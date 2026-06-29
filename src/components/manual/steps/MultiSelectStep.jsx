export default function MultiSelectStep({ question, value = [], onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  return (
    <div className="animate-fade-up">
      <p className="text-mist text-xs mb-4">Select all that apply</p>
      <div className="grid grid-cols-2 gap-2">
        {question.options.map(opt => {
          const selected = value.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all duration-200 active:scale-95
                ${selected
                  ? 'border-gold bg-gold/10 text-cream'
                  : 'border-steel/20 text-mist hover:border-steel/50 hover:text-cream'}`}
            >
              {selected && <span className="text-gold mr-1">✓</span>}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
