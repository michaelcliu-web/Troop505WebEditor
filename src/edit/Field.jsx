import { newId } from '../schema'

/*
  One labeled control in the properties panel.

  It doesn't know what it's editing — it's handed a value and a function to call when that value
  changes. That's the standard React pattern for form inputs: the input doesn't own its value,
  the app does. The input just reports "the user typed this", and the app decides what to do.

  (You'll hear this called a "controlled component". The name is worse than the idea.)
*/

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[var(--color-ember)] focus:ring-2 focus:ring-[var(--color-ember)]/20'

export default function Field({ control, value, onChange }) {
  const { label, type, hint, options, placeholder, min, max, step } = control

  function renderInput() {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'select':
        return (
          <select
            className={inputClass}
            value={value ?? ''}
            onChange={(e) => {
              // <select> always gives back a string, but some of our values are numbers
              // (gallery columns). Convert back so the data keeps its real type.
              const raw = e.target.value
              const match = options.find((o) => String(o.value) === raw)
              onChange(match ? match.value : raw)
            }}
          >
            {options.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            type="number"
            className={inputClass}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        )

      case 'range':
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              className="flex-1 accent-[var(--color-ember)]"
              min={min}
              max={max}
              step={step}
              value={value ?? 0}
              onChange={(e) => onChange(Number(e.target.value))}
            />
            <span className="w-10 text-right text-xs tabular-nums text-stone-500">
              {Math.round((value ?? 0) * 100)}%
            </span>
          </div>
        )

      case 'urlList':
        // A gallery is a list of {id, src, alt}. Editing that as raw objects would be awful,
        // so the panel shows one URL per line and converts in both directions.
        return (
          <textarea
            className={`${inputClass} min-h-28 resize-y font-mono text-xs`}
            value={(value ?? []).map((img) => img.src).join('\n')}
            placeholder={'https://...\nhttps://...'}
            onChange={(e) => {
              const urls = e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
              const existing = value ?? []
              onChange(
                urls.map((src, i) => ({
                  // Reuse the existing id when a row hasn't moved, so React doesn't
                  // needlessly tear down and rebuild every image on each keystroke.
                  id: existing[i]?.id ?? newId('img'),
                  src,
                  alt: existing[i]?.alt ?? '',
                })),
              )
            }}
          />
        )

      default:
        return (
          <input
            type="text"
            className={inputClass}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )
    }
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</span>
      {renderInput()}
      {hint && <span className="mt-1 block text-xs leading-snug text-stone-500">{hint}</span>}
    </label>
  )
}
