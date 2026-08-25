import { BLOCK_TYPES } from '../schema'
import { BLOCK_CONTROLS, SECTION_CONTROLS } from './controls'
import Field from './Field'

/*
  The properties panel — the thing that replaces hand-editing fixture.js.

  It builds itself from the control descriptions in controls.js. It contains no knowledge of
  any particular block type, which is why adding a new block type doesn't require touching
  this file at all.
*/

export default function PropertiesPanel({
  selection,
  block,
  section,
  onChangeBlockProp,
  onChangeBlockWidth,
  onChangeSection,
}) {
  if (!selection) {
    return (
      <Shell title="Nothing selected">
        <p className="text-sm leading-relaxed text-stone-600">
          Click anything on the page to change it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Click the empty space around the content to change that whole stripe&apos;s background.
        </p>
      </Shell>
    )
  }

  if (selection.type === 'section' && section) {
    return (
      <Shell title="This stripe" subtitle="Background and spacing for this band of the page">
        {SECTION_CONTROLS.map((control, i) => {
          if (control.showIf && !control.showIf(section)) return null
          return (
            <Field
              key={`${control.key}-${i}`}
              control={control}
              value={readPath(section, control.key)}
              onChange={(value) => onChangeSection(control.key, value)}
            />
          )
        })}
      </Shell>
    )
  }

  if (selection.type === 'block' && block) {
    const spec = BLOCK_TYPES[block.type]
    const controls = BLOCK_CONTROLS[block.type] ?? []

    return (
      <Shell title={spec?.label ?? block.type}>
        {controls.map((control) => (
          <Field
            key={control.key}
            control={control}
            value={block.props[control.key]}
            onChange={(value) => onChangeBlockProp(control.key, value)}
          />
        ))}

        <div className="border-t border-stone-200 pt-4">
          <Field
            control={{
              label: 'How much of the row it takes up',
              type: 'range',
              // The Field's range control displays its value as a percentage,
              // so it works in 0–1 and we convert to/from the stored 20–100.
              min: 0.2,
              max: 1,
              step: 0.05,
              hint: 'Two blocks at 50% sit side by side. On a phone they stack automatically.',
            }}
            value={block.width / 100}
            onChange={(v) => onChangeBlockWidth(Math.round(v * 100))}
          />
        </div>
      </Shell>
    )
  }

  return null
}

function Shell({ title, subtitle, children }) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-stone-200 bg-stone-50">
      <div className="border-b border-stone-200 px-5 py-4">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-stone-900">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">{children}</div>
    </aside>
  )
}

/** Read "background.overlay" out of an object. */
function readPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
