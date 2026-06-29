import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar.jsx'

export default function AppShell({ children, current, total, onBack, label }) {
  const nav = useNavigate()

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-steel/10">
        <div className="font-display text-2xl tracking-widest text-white">
          JACKIE <span className="text-gold">JEANS</span>
        </div>
        <button
          onClick={onBack || (() => nav('/'))}
          className="text-mist text-sm border border-mist/25 px-4 py-2 rounded-lg hover:border-cream hover:text-cream transition-all duration-200 active:scale-95"
        >
          ← Back
        </button>
      </header>

      {/* Progress */}
      {current !== undefined && (
        <ProgressBar current={current} total={total} label={label} />
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
