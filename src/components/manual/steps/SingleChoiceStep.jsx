export default function SingleChoiceStep({ question, value, onChange }) {
  return (
    <div className="animate-fade-up space-y-3">
      {question.options.map(opt => (
        <button
          key={opt.value}
          className={`choice-btn ${value === opt.value ? 'selected' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200
              ${value === opt.value ? 'border-gold bg-gold' : 'border-steel/40'}`}>
              {value === opt.value && (
                <div className="w-2 h-2 rounded-full bg-ink" />
              )}
            </div>
            <div className="text-left">
              <div className="text-cream font-semibold text-sm">{opt.label}</div>
              <div className="text-mist text-xs mt-0.5 leading-relaxed">{opt.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
