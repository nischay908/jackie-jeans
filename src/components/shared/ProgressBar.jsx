export default function ProgressBar({ current, total, label }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="px-6 pt-4 pb-1">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-mist">
          {label || `Question ${current} of ${total}`}
        </span>
        <span className="text-xs text-mist">{pct}%</span>
      </div>
      <div className="h-[2px] bg-steel/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #2B3F72, #C9A84C)',
          }}
        />
      </div>
    </div>
  )
}
