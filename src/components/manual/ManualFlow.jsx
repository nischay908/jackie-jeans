import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell.jsx'
import CompletionScreen from '../shared/CompletionScreen.jsx'
import DropdownStep from './steps/DropdownStep.jsx'
import NumberStep from './steps/NumberStep.jsx'
import SingleChoiceStep from './steps/SingleChoiceStep.jsx'
import MultiSelectStep from './steps/MultiSelectStep.jsx'
import BrandSizeStep from './steps/BrandSizeStep.jsx'
import { QUESTIONS } from '../../data/quizData.js'

const TOTAL = QUESTIONS.length  // 10

export default function ManualFlow() {
  const nav = useNavigate()
  const [step, setStep]       = useState(0)   // 0-indexed
  const [answers, setAnswers] = useState({})
  const [done, setDone]       = useState(false)
  const [key, setKey]         = useState(0)    // force re-mount for animation

  const q       = QUESTIONS[step]
  const isLast  = step === TOTAL - 1

  // ── can we advance? ──────────────────────────────────────────────────────
  const canAdvance = () => {
    if (q.optional) return true          // optional → always can proceed
    const val = answers[q.id]
    if (q.type === 'multiselect') return Array.isArray(val) && val.length > 0
    if (q.type === 'brandsize') {
      const brands = answers['brands'] || []
      return brands.every(b => answers.brandSizes?.[b])
    }
    return val !== undefined && val !== '' && val !== null
  }

  // ── handlers ─────────────────────────────────────────────────────────────
  const setAnswer = (val) => setAnswers(prev => ({ ...prev, [q.id]: val }))
  const setBrandSizes = (val) => setAnswers(prev => ({ ...prev, brandSizes: val }))

  const advance = () => {
    if (isLast) { setDone(true); return }

    // Skip brandsize step if no brands selected
    let next = step + 1
    if (QUESTIONS[next]?.id === 'brandSizes' && (!answers.brands || answers.brands.length === 0)) {
      next = step + 2
    }
    setStep(next)
    setKey(k => k + 1)
  }

  const goBack = () => {
    if (step === 0) { nav('/'); return }
    let prev = step - 1
    if (QUESTIONS[prev]?.id === 'brandSizes' && (!answers.brands || answers.brands.length === 0)) {
      prev = step - 2
    }
    setStep(Math.max(0, prev))
    setKey(k => k + 1)
  }

  const handleSkip = () => {
    setAnswers(prev => ({ ...prev, [q.id]: 'skipped' }))
    advance()
  }

  if (done) {
    return (
      <AppShell label="Complete!" current={TOTAL} total={TOTAL}>
        <CompletionScreen answers={answers} />
      </AppShell>
    )
  }

  return (
    <AppShell
      current={step + 1}
      total={TOTAL}
      onBack={goBack}
    >
      <div className="flex-1 flex flex-col px-6 py-6" key={key}>

        {/* Eyebrow */}
        <p className="label-sm mb-3">Question {q.number} of {TOTAL}</p>

        {/* Question */}
        <h2 className="font-display text-[clamp(30px,8vw,52px)] leading-tight text-white mb-2 tracking-wide">
          {q.question}
        </h2>

        {/* Why it matters */}
        <p className="text-mist text-sm mb-6 leading-relaxed">{q.why}</p>

        {/* Input */}
        <div className="flex-1 overflow-y-auto pb-4">
          {q.type === 'dropdown' && (
            <DropdownStep question={q} value={answers[q.id]} onChange={setAnswer} />
          )}
          {q.type === 'number' && (
            <NumberStep
              question={q}
              value={answers[q.id]}
              onChange={setAnswer}
              onSkip={handleSkip}
            />
          )}
          {q.type === 'single' && (
            <SingleChoiceStep question={q} value={answers[q.id]} onChange={setAnswer} />
          )}
          {q.type === 'multiselect' && (
            <MultiSelectStep question={q} value={answers[q.id]} onChange={setAnswer} />
          )}
          {q.type === 'brandsize' && (
            <BrandSizeStep
              brands={answers.brands || []}
              value={answers.brandSizes || {}}
              onChange={setBrandSizes}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="pt-4 space-y-3">
          <button
            className="btn-gold"
            disabled={!canAdvance()}
            onClick={advance}
          >
            {isLast ? 'Get My Fit →' : 'Next →'}
          </button>
          {step > 0 && (
            <button className="btn-ghost" onClick={goBack}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
