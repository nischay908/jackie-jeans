import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">

      {/* Logo */}
      <div className="mb-2">
        <h1 className="font-display text-[clamp(64px,18vw,130px)] leading-none tracking-widest text-white">
          JACKIE<br />JEANS
        </h1>
        <p className="font-body font-light tracking-[0.35em] text-gold text-sm mt-2 uppercase">
          Smart Fit Onboarding
        </p>
      </div>

      {/* Tagline */}
      <p className="font-serif italic text-mist text-lg mt-6 mb-12 max-w-xs leading-relaxed">
        Find the cut that was made for your body — not the other way around.
      </p>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">

        {/* Manual */}
        <button
          onClick={() => nav('/manual')}
          className="card text-left hover:border-gold/60 hover:-translate-y-1 transition-all duration-300 active:scale-95"
        >
          <span className="text-4xl block mb-3">📋</span>
          <h3 className="font-display text-2xl tracking-wide text-white mb-1">Manual Fit Quiz</h3>
          <p className="text-mist text-sm leading-relaxed mb-4">
            Fill in a guided quiz at your own pace. Fast, clean, mobile-friendly.
          </p>
          <span className="text-xs font-semibold tracking-widest uppercase text-gold border border-gold/40 px-3 py-1 rounded-full">
            Step-by-step form
          </span>
        </button>

        {/* Voice */}
        <button
          onClick={() => nav('/voice')}
          className="card text-left hover:border-gold/60 hover:-translate-y-1 transition-all duration-300 active:scale-95"
        >
          <span className="text-4xl block mb-3">🎤</span>
          <h3 className="font-display text-2xl tracking-wide text-white mb-1">AI Voice Stylist</h3>
          <p className="text-mist text-sm leading-relaxed mb-4">
            Talk to Jackie, your AI denim stylist. She asks, you answer out loud — completely hands-free.
          </p>
          <span className="text-xs font-semibold tracking-widest uppercase text-gold border border-gold/40 px-3 py-1 rounded-full">
            Voice powered by AI
          </span>
        </button>
      </div>

      <p className="text-mist/40 text-xs mt-10 tracking-wider">
        Takes about 2 minutes · No account needed
      </p>
    </div>
  )
}
