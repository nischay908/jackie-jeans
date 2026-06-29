import { useEffect } from 'react'

const FIT_PROFILES = {
  fitted_snug_high:     { name: 'The Sharp Edge', style: 'High-rise slim · No waist gap guaranteed' },
  fitted_snug_mid:      { name: 'The Classic Cut', style: 'Mid-rise fitted · Crisp and structured' },
  fitted_relaxed_mid:   { name: 'The Easy Sleek', style: 'Mid-rise fitted thigh · All-day comfort' },
  relaxed_relaxed_low:  { name: 'The Weekend Favourite', style: 'Low-rise relaxed · Maximum ease' },
  loose_relaxed_low:    { name: 'The Street Standard', style: 'Low-rise loose · Oversized done right' },
}

function getProfile(answers) {
  const key = `${answers.thighFit || 'fitted'}_${answers.waistFit || 'snug'}_${answers.rise || 'mid'}`
  return FIT_PROFILES[key] || { name: 'Your Signature Fit', style: `${answers.thighFit || 'Fitted'} through the thigh · ${answers.rise || 'Mid'} rise` }
}

export default function CompletionScreen({ answers }) {
  const profile = getProfile(answers)

  // Redirect after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      Object.entries(answers).forEach(([k, v]) => {
        params.set(k, typeof v === 'object' ? JSON.stringify(v) : v)
      })
      window.location.href = `https://jackie-jeans.vercel.app/?${params.toString()}`
    }, 4000)
    return () => clearTimeout(timer)
  }, [answers])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center animate-fade-up">
      <div className="text-6xl mb-6">✨</div>

      <p className="label-sm mb-3">Your Fit Profile</p>
      <h2 className="font-display text-5xl tracking-wide text-white mb-2">{profile.name}</h2>
      <p className="font-serif italic text-gold text-lg mb-8">{profile.style}</p>

      {/* Summary tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
        {answers.height && <span className="tag">{answers.height}</span>}
        {answers.waist  && <span className="tag">W {answers.waist}</span>}
        {answers.hips   && <span className="tag">H {answers.hips}</span>}
        {answers.rise   && <span className="tag">{answers.rise} rise</span>}
        {answers.frustration && <span className="tag">Fix: {answers.frustration.replace('-', ' ')}</span>}
        {answers.brands?.slice(0,3).map(b => <span key={b} className="tag">{b}</span>)}
      </div>

      <div className="card w-full max-w-sm text-left mb-8">
        <p className="label-sm mb-2">What this means for you</p>
        <p className="text-cream text-sm leading-relaxed">
          Based on your measurements and preferences, we've found your ideal Jackie Jeans fit.
          {answers.frustration === 'waist-gap' && "We've specifically accounted for your waist gap concern — our high-hip ratio cuts will solve that."}
          {answers.frustration === 'hip-tight' && ' Hip tightness is our speciality — our stretch-denim range is cut wide where it matters.'}
          {answers.frustration === 'wrong-length' && ' Length issues end here — we offer every inseam from 28" to 36" in every style.'}
          {' '}Your fit profile has been saved.
        </p>
      </div>

      <p className="text-mist text-sm">
        Taking you to Jackie Jeans in a moment…
      </p>
      <div className="mt-3 h-1 w-32 bg-steel/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full"
          style={{ animation: 'grow 4s linear forwards' }}
        />
      </div>

      <button
        onClick={() => {
          const params = new URLSearchParams()
          Object.entries(answers).forEach(([k, v]) => {
            params.set(k, typeof v === 'object' ? JSON.stringify(v) : v)
          })
          window.location.href = `https://jackie-jeans.vercel.app/?${params.toString()}`
        }}
        className="mt-6 btn-gold max-w-sm"
      >
        Go to Jackie Jeans Now →
      </button>

      <style>{`
        @keyframes grow {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}
