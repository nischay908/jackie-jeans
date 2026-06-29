// ─── SPEECH SYNTHESIS ─────────────────────────────────────────────────────
let currentUtterance = null

export function speak(text, onEnd) {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate  = 0.92
  utter.pitch = 1.05
  utter.volume = 1

  // Pick the best English voice
  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find(v => v.lang === 'en-US' && /samantha|karen|zira|google us english/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('en-') && v.localService) ||
    voices.find(v => v.lang.startsWith('en'))
  if (preferred) utter.voice = preferred

  utter.onend  = () => onEnd && onEnd()
  utter.onerror = () => onEnd && onEnd()
  currentUtterance = utter
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
}

// ─── SPEECH RECOGNITION ───────────────────────────────────────────────────
let recognitionInstance = null

export function startListening({ onInterim, onFinal, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    onError('NOT_SUPPORTED')
    return null
  }

  const rec = new SR()
  rec.continuous      = false
  rec.interimResults  = true
  rec.lang            = 'en-US'
  rec.maxAlternatives = 1

  rec.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('')
    const isFinal = e.results[e.results.length - 1].isFinal
    if (isFinal) {
      onFinal(transcript.trim())
    } else {
      onInterim && onInterim(transcript.trim())
    }
  }

  rec.onerror = (e) => {
    if (e.error !== 'no-speech') onError(e.error)
  }

  rec.start()
  recognitionInstance = rec
  return rec
}

export function stopListening() {
  if (recognitionInstance) {
    recognitionInstance.stop()
    recognitionInstance = null
  }
}

// ─── CLAUDE AI ────────────────────────────────────────────────────────────
export async function claudeAI(systemPrompt, messages) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    })
    const data = await res.json()
    return data.content?.find(b => b.type === 'text')?.text || ''
  } catch (err) {
    console.error('Claude API error:', err)
    return null
  }
}

// ─── ANSWER PARSERS ───────────────────────────────────────────────────────

export function parseHeight(text) {
  // "five foot six" / "5'6" / "168" / "168 cm"
  const patterns = [
    /(\d+)\s*(?:foot|feet|')\s*(\d+)/i,
    /(\d+)\s*(?:cm|centimetre|centimeter)/i,
    /(\d+)'\s*(\d+)?"/,
  ]
  const t = text.toLowerCase()
  // verbal numbers
  const words = {
    zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
    ten:10,eleven:11,twelve:12
  }
  let replaced = t.replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/g,
    m => words[m])
  const ftIn = replaced.match(/(\d+)\s*(?:foot|feet|ft|')\s*(\d+)?/)
  if (ftIn) {
    const ft  = parseInt(ftIn[1])
    const ins = parseInt(ftIn[2] || '0')
    return `${ft}'${ins}"`
  }
  const cm = replaced.match(/(\d{2,3})\s*(?:cm|centimetre|centimeter)?/)
  if (cm) {
    const inches = Math.round(parseInt(cm[1]) / 2.54)
    const ft = Math.floor(inches / 12)
    const i  = inches % 12
    return `${ft}'${i}"`
  }
  return null
}

export function parseNumber(text) {
  const match = text.match(/\d+/)
  return match ? match[0] : null
}

export function parseSingleChoice(text, options) {
  const t = text.toLowerCase()
  // Try exact match first, then partial
  for (const opt of options) {
    if (t.includes(opt.value.replace('-', ' ')) || t.includes(opt.label.toLowerCase())) {
      return opt.value
    }
  }
  // fuzzy: first keyword match
  for (const opt of options) {
    const words = opt.label.toLowerCase().split(' ')
    if (words.some(w => t.includes(w) && w.length > 3)) return opt.value
  }
  return null
}

export function parseBrands(text, brandList) {
  const t = text.toLowerCase()
  return brandList.filter(brand =>
    t.includes(brand.toLowerCase()) ||
    t.includes(brand.toLowerCase().replace("'", ''))
  )
}

export function parseBrandSize(text) {
  // "medium" / "32" / "small" etc.
  const sizeWords = { 'extra small': 'XS', 'small': 'S', 'medium': 'M', 'large': 'L', 'extra large': 'XL' }
  const t = text.toLowerCase()
  for (const [word, val] of Object.entries(sizeWords)) {
    if (t.includes(word)) return val
  }
  const num = text.match(/\b(2[4-9]|3[0-9]|4[0-2]|XS|S|M|L|XL|XXL)\b/i)
  return num ? num[1].toUpperCase() : null
}

export function parseFrustration(text) {
  const t = text.toLowerCase()
  if (t.includes('waist') && (t.includes('gap') || t.includes('back'))) return 'waist-gap'
  if (t.includes('hip') || t.includes('tight')) return 'hip-tight'
  if (t.includes('length') || t.includes('long') || t.includes('short')) return 'wrong-length'
  if (t.includes('thigh') || t.includes('leg')) return 'thigh-fit'
  if (t.includes('rise') || t.includes('waistband') || t.includes('sits')) return 'rise'
  return 'other'
}
