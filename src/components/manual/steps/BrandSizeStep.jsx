import { SIZES } from '../../../data/quizData.js'

export default function BrandSizeStep({ brands, value = {}, onChange }) {
  const setSize = (brand, size) => {
    onChange({ ...value, [brand]: size })
  }

  return (
    <div className="animate-fade-up space-y-4">
      <p className="text-mist text-xs">What size do you normally buy in each brand?</p>
      {brands.map(brand => (
        <div key={brand} className="card">
          <div className="label-sm mb-2">{brand}</div>
          <div className="select-wrap">
            <select
              className="select-field"
              value={value[brand] || ''}
              onChange={e => setSize(brand, e.target.value)}
            >
              <option value="" disabled>Your size…</option>
              {SIZES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
