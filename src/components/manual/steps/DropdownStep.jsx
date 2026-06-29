export default function DropdownStep({ question, value, onChange }) {
  return (
    <div className="animate-fade-up">
      <div className="select-wrap">
        <select
          className="select-field"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value="" disabled>Select an option…</option>
          {question.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
