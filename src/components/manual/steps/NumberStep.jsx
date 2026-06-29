export default function NumberStep({ question, value, onChange, onSkip }) {
  return (
    <div className="animate-fade-up space-y-4">
      <input
        type="text"
        inputMode="numeric"
        className="input-field"
        placeholder={question.placeholder}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
      {question.optional && (
        <button
          onClick={onSkip}
          className="w-full text-mist text-sm py-3 border border-mist/20 rounded-xl
                     hover:border-mist/50 hover:text-cream transition-all duration-200 active:scale-95"
        >
          Skip this question →
        </button>
      )}
    </div>
  )
}
