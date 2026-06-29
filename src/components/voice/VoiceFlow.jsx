import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell.jsx'
import CompletionScreen from '../shared/CompletionScreen.jsx'
import { QUESTIONS, VOICE_QUESTIONS, BRANDS } from '../../data/quizData.js'
import {
  speak, stopSpeaking, startListening, stopListening, claudeAI,
  parseHeight, parseNumber, parseSingleChoice, parseBrands,
  parseBrandSize, parseFrustration,
} from '../../utils/voiceAI.js'

// ─── STATES ───────────────────────────────────────────────────────────────
const S = {
  IDLE:        'idle',
  AI_SPEAKING: 'ai_speaking',
  LISTENING:   'listening',
  PROCESSING:  'processing',
  CONFIRMING:  'confirming',
  DONE:        'done',
}

const TOTAL = QUESTIONS.length

// Build the spoken question for brandSizes dynamically
function getBrandSizesQuestion(brands) {
  if (!brands || brands.length === 0) return null
  if (brands.length === 1) return `What size do you buy in ${brands[0]}?`
  const last = brands[brands.length - 1]
  const rest = brands.slice(0, -1).join(', ')
  return `What size do you normally buy in ${rest} and ${last}? You can go through them one by one.`
}

export default function VoiceFlow() {
  const nav = useNavigate()
  const [state,     setState]     = useState(S.IDLE)
  const [qIndex,    setQIndex]    = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [aiMsg,     setAiMsg]     = useState("Hi! I'm Jackie, your personal denim stylist. Tap the mic and I'll guide you through finding your perfect fit — just answer out loud.")
  const [userMsg,   setUserMsg]   = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [done,      setDone]      = useState(false)
  const [brandQueue, setBrandQueue] = useState([])   // for Q9 per-brand
  const [currentBrand, setCurrentBrand] = useState(null)
  const [pendingBrandSizes, setPendingBrandSizes] = useState({})
  const conversationRef = useRef([])

  // ── speak helper ─────────────────────────────────────────────────────────
  const aiSpeak = useCallback((text, afterCb) => {
    setState(S.AI_SPEAKING)
    setAiMsg(text)
    speak(text, () => {
      setState(S.IDLE)
      if (afterCb) afterCb()
    })
  }, [])

  // ── ask a question ────────────────────────────────────────────────────────
  const askQuestion = useCallback((idx, overrideText) => {
    const q    = QUESTIONS[idx]
    let spoken = overrideText || VOICE_QUESTIONS[idx]

    if (!spoken && q.id === 'brandSizes') {
      // handled separately via brandQueue
      return
    }
    aiSpeak(spoken, () => setState(S.IDLE))
  }, [aiSpeak])

  // ── start listening ───────────────────────────────────────────────────────
  const listen = useCallback(() => {
    if (state === S.AI_SPEAKING || state === S.LISTENING || state === S.PROCESSING) return
    setState(S.LISTENING)
    setUserMsg('')
    setStatusMsg('Listening…')

    startListening({
      onInterim: (t) => setUserMsg(t),
      onFinal:   (t) => {
        setUserMsg(t)
        stopListening()
        setState(S.PROCESSING)
        setStatusMsg('Processing…')
        processAnswer(t)
      },
      onError: (err) => {
        setState(S.IDLE)
        setStatusMsg('')
        if (err === 'NOT_SUPPORTED') {
          setAiMsg("Voice isn't supported in this browser. Please try Chrome on Android or Safari on iPhone.")
        } else {
          aiSpeak("I didn't quite catch that. Could you try again?")
        }
      }
    })
  }, [state]) // eslint-disable-line

  // ── process a spoken answer ───────────────────────────────────────────────
  const processAnswer = useCallback(async (text) => {
    const q = QUESTIONS[qIndex]
    conversationRef.current.push({ role: 'user', content: text })

    // ── SKIP for optional ────────────────────────────────────────────────
    if (q.optional && /skip|no|pass|don't|dont|rather not|private/i.test(text)) {
      setAnswers(prev => ({ ...prev, [q.id]: 'skipped' }))
      advanceQuestion(qIndex, 'skipped', answers)
      return
    }

    // ── PARSE by question type ───────────────────────────────────────────
    let parsed = null
    const q_obj = QUESTIONS[qIndex]

    if (q_obj.id === 'height') {
      parsed = parseHeight(text)
      if (!parsed) {
        // Ask Claude to interpret
        const aiParse = await claudeAI(
          'Extract the height value from the text. Respond ONLY with the height in format like 5\'6" or 168cm. If unclear, respond with UNCLEAR.',
          [{ role: 'user', content: text }]
        )
        if (aiParse && !aiParse.includes('UNCLEAR')) parsed = aiParse.trim()
      }
    } else if (q_obj.id === 'weight') {
      parsed = text // accept anything
    } else if (q_obj.id === 'waist' || q_obj.id === 'hips') {
      const num = parseNumber(text)
      if (num) {
        parsed = `${num}"`
        // validate range
        const n = parseInt(num)
        if (q_obj.id === 'waist' && (n < 24 || n > 52)) parsed = null
        if (q_obj.id === 'hips'  && (n < 32 || n > 60)) parsed = null
      }
      if (!parsed) {
        const aiParse = await claudeAI(
          `Extract a number (inches) for ${q_obj.id} measurement. Respond ONLY with the number or UNCLEAR.`,
          [{ role: 'user', content: text }]
        )
        if (aiParse && !aiParse.includes('UNCLEAR')) parsed = `${aiParse.trim()}"`
      }
    } else if (q_obj.type === 'single') {
      parsed = parseSingleChoice(text, q_obj.options)
      if (!parsed) {
        const opts = q_obj.options.map(o => o.label).join(', ')
        const aiParse = await claudeAI(
          `The user is answering a question. Options are: ${opts}. Which option did they choose? Respond with ONLY the option label or UNCLEAR.`,
          [{ role: 'user', content: text }]
        )
        if (aiParse && !aiParse.includes('UNCLEAR')) {
          const match = q_obj.options.find(o =>
            o.label.toLowerCase() === aiParse.trim().toLowerCase() ||
            o.value === aiParse.trim().toLowerCase()
          )
          if (match) parsed = match.value
        }
      }
    } else if (q_obj.id === 'brands') {
      parsed = parseBrands(text, BRANDS)
      if (!parsed || parsed.length === 0) {
        // Use Claude to extract brand names
        const brandList = BRANDS.join(', ')
        const aiParse = await claudeAI(
          `From this list of denim brands: ${brandList}. Which ones did the user mention? Respond with a comma-separated list of brand names exactly as they appear in the list, or NONE.`,
          [{ role: 'user', content: text }]
        )
        if (aiParse && !aiParse.includes('NONE')) {
          parsed = aiParse.split(',').map(b => b.trim()).filter(b => BRANDS.includes(b))
        }
      }
      if (!parsed || parsed.length === 0) parsed = []
    } else if (q_obj.id === 'brandSizes') {
      // handled in dedicated brand-size loop
      const size = parseBrandSize(text)
      if (currentBrand) {
        const newSizes = { ...pendingBrandSizes, [currentBrand]: size || text }
        setPendingBrandSizes(newSizes)
        advanceBrandQueue(newSizes)
        return
      }
    } else if (q_obj.id === 'frustration') {
      parsed = parseFrustration(text)
    }

    // ── UNCLEAR — re-ask ─────────────────────────────────────────────────
    if (parsed === null || parsed === undefined) {
      const reask = await claudeAI(
        'You are Jackie, a friendly denim stylist. The user gave an unclear answer. Politely ask them to repeat in 1 short sentence.',
        conversationRef.current.slice(-3)
      ) || "I didn't quite get that — could you say it again?"
      aiSpeak(reask)
      setState(S.IDLE)
      return
    }

    // ── CONFIRM & ADVANCE ────────────────────────────────────────────────
    const currentAnswers = { ...answers, [q_obj.id]: parsed }
    setAnswers(currentAnswers)

    // Generate acknowledgement via Claude
    const confirmText = await generateConfirmation(q_obj, parsed, qIndex)

    conversationRef.current.push({ role: 'assistant', content: confirmText })
    setState(S.AI_SPEAKING)
    setAiMsg(confirmText)

    speak(confirmText, () => {
      advanceQuestion(qIndex, parsed, currentAnswers)
    })
  }, [qIndex, answers, currentBrand, pendingBrandSizes, aiSpeak]) // eslint-disable-line

  // ── generate AI confirmation ──────────────────────────────────────────────
  async function generateConfirmation(q, parsed, idx) {
    const isLast = idx === TOTAL - 1
    const system = `You are Jackie, a warm and confident denim stylist at Jackie Jeans.
Acknowledge the user's answer in 1 short sentence (max 15 words). Be warm and natural.
${isLast ? 'This is the last question, so say something like "Perfect, I have everything I need!"' : 'End by saying something like "Now let me ask you about..."'}
Do NOT repeat the question. Do NOT say "Great" or "Awesome" every time — vary your response.`

    const humanVal = typeof parsed === 'object' ? JSON.stringify(parsed) : parsed
    const result = await claudeAI(system, [
      { role: 'user', content: `Question was: "${q.question}". User answered: "${humanVal}"` }
    ])
    return result || `Got it — ${humanVal}. Moving on!`
  }

  // ── advance to next question ──────────────────────────────────────────────
  function advanceQuestion(idx, parsed, currentAnswers) {
    const nextIdx = idx + 1

    if (nextIdx >= TOTAL) {
      // All done!
      setState(S.DONE)
      setDone(true)
      return
    }

    const nextQ = QUESTIONS[nextIdx]

    // If next question is brandSizes, start brand queue
    if (nextQ.id === 'brandSizes') {
      const brands = currentAnswers.brands || []
      if (brands.length === 0) {
        // skip brandSizes entirely
        setQIndex(nextIdx + 1)
        askQuestion(nextIdx + 1)
        return
      }
      // start the brand-by-brand size loop
      setBrandQueue(brands.slice(1))
      setCurrentBrand(brands[0])
      setQIndex(nextIdx)
      const q = `What size do you normally buy in ${brands[0]}?`
      aiSpeak(q)
      return
    }

    setQIndex(nextIdx)
    askQuestion(nextIdx)
  }

  // ── brand size queue ──────────────────────────────────────────────────────
  function advanceBrandQueue(sizes) {
    if (brandQueue.length === 0) {
      // done with all brands
      setAnswers(prev => ({ ...prev, brandSizes: sizes }))
      const nextIdx = qIndex + 1
      if (nextIdx >= TOTAL) { setDone(true); return }
      aiSpeak(`Got all your sizes — thanks! Now, my last question.`, () => {
        setQIndex(nextIdx)
        askQuestion(nextIdx)
      })
      return
    }
    const nextBrand = brandQueue[0]
    setBrandQueue(prev => prev.slice(1))
    setCurrentBrand(nextBrand)
    const q = `And what size in ${nextBrand}?`
    aiSpeak(q)
  }

  // ── toggle mic ────────────────────────────────────────────────────────────
  const toggleMic = () => {
    if (state === S.AI_SPEAKING || state === S.PROCESSING) return
    if (state === S.LISTENING) {
      stopListening()
      setState(S.IDLE)
      setStatusMsg('')
      return
    }
    listen()
  }

  // ── first load — voices need time ─────────────────────────────────────────
  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {}
    }
    return () => { stopSpeaking(); stopListening() }
  }, [])

  // ── render ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <AppShell label="Complete!" current={TOTAL} total={TOTAL}>
        <CompletionScreen answers={answers} />
      </AppShell>
    )
  }

  const isListening  = state === S.LISTENING
  const isSpeaking   = state === S.AI_SPEAKING
  const isProcessing = state === S.PROCESSING
  const micDisabled  = isSpeaking || isProcessing

  const dotsDone = qIndex
  const dotsTotal = TOTAL

  return (
    <AppShell
      current={qIndex + 1}
      total={TOTAL}
      onBack={() => { stopSpeaking(); stopListening(); nav('/') }}
    >
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-6 text-center">

        {/* AI Avatar */}
        <div className={`w-24 h-24 rounded-full bg-denim border-2 border-steel/30
                         flex items-center justify-center text-5xl mb-6 transition-all duration-300
                         ${isSpeaking ? 'avatar-speaking' : ''}`}>
          👗
        </div>

        {/* Transcript card */}
        <div className="card w-full max-w-sm text-left mb-6 flex-1 flex flex-col">
          {/* AI message */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              J
            </div>
            <p className="text-cream text-sm leading-relaxed">{aiMsg}</p>
          </div>

          {/* User reply area */}
          {(userMsg || isListening || isProcessing) && (
            <div className="border-t border-steel/15 pt-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-gold">
                U
              </div>
              <p className={`text-sm leading-relaxed ${isListening ? 'text-gold blink' : 'text-mist italic'}`}>
                {isListening && !userMsg ? '🎙️ Listening…' : userMsg || '…'}
              </p>
            </div>
          )}

          {/* Status */}
          {(statusMsg || isProcessing) && (
            <p className="text-mist/60 text-xs mt-3">
              {isProcessing ? '⚙️ Processing…' : statusMsg}
            </p>
          )}
        </div>

        {/* Mic button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={toggleMic}
            disabled={micDisabled}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl
                        transition-all duration-200 active:scale-95 shadow-xl
                        ${micDisabled
                          ? 'bg-steel/20 cursor-not-allowed opacity-40'
                          : isListening
                            ? 'mic-recording bg-red-500'
                            : 'bg-gold hover:bg-gold/90'}`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? '⏹️' : isSpeaking ? '🔊' : isProcessing ? '⚙️' : '🎤'}
          </button>

          <p className="text-mist text-xs tracking-widest uppercase">
            {isSpeaking  ? 'Jackie is speaking…'
             : isListening ? 'Tap to stop'
             : isProcessing ? 'Processing…'
             : 'Tap to answer'}
          </p>

          {/* Skip button for optional question */}
          {QUESTIONS[qIndex]?.optional && state === S.IDLE && (
            <button
              onClick={() => processAnswer('skip')}
              className="text-mist text-xs border border-mist/20 px-4 py-2 rounded-full
                         hover:border-mist/50 hover:text-cream transition-all duration-200"
            >
              Skip this question
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < dotsDone ? 'bg-gold' :
                i === dotsDone ? 'bg-steel' :
                'bg-steel/20'
              }`}
            />
          ))}
        </div>

        {/* Start button — shown only before first question answered */}
        {state === S.IDLE && qIndex === 0 && !userMsg && (
          <button
            className="btn-gold mt-4 max-w-xs"
            onClick={() => askQuestion(0)}
          >
            Start Voice Quiz →
          </button>
        )}

      </div>
    </AppShell>
  )
}
