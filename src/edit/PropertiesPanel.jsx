import { BLOCK_TYPES } from '../schema'
import { BigButton, Divider, Shell } from './PanelShell'
import { BLOCK_CONTROLS, SECTION_CONTROLS } from './controls'
import Field from './Field'

/*
  The properties panel — the thing that replaces hand-editing fixture.js.

  It builds itself from the control descriptions in controls.js. It contains no knowledge of
  any particular block type, which is why adding a new block type doesn't require touching
  this file at all.

  It changes nothing itself. Every button calls a function App handed down, and App does
  the actual work.
*/

export default function PropertiesPanel({
  selection,
  block,
  section,
  onChangeBlockProp,
  onChangeBlockWidth,
  onChangeSection,
  onAddBlock,
  onRemoveBlock,
  onAddSection,
  onRemoveSection,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onShowVersions,
}) {
  // Passed to every Shell below so the undo row shows in all panel states.
  const history = { onUndo, onRedo, canUndo, canRedo, onShowVersions }
  if (!selection) {
    return (
      <Shell title="Nothing selected" history={history}>
        <p className="text-sm leading-relaxed text-stone-600">
          Click anything on the page to change it.
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          Click the empty space around the content to change that whole stripe&apos;s background.
        </p>
        <BigButton onClick={onAddSection}>Add a new stripe</BigButton>
      </Shell>
    )
  }

  if (selection.type === 'section' && section) {
    return (
      <Shell title="This stripe" subtitle="Background and spacing for this band of the page" history={history}>
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

        <Divider label="Put something in this stripe" />
        <div className="flex flex-col gap-2">
          {Object.entries(BLOCK_TYPES).map(([type, spec]) => (
            <BigButton key={type} onClick={() => onAddBlock(type)}>
              {spec.addLabel}
            </BigButton>
          ))}
        </div>

        <Divider />
        <BigButton onClick={onAddSection}>Add another stripe below</BigButton>
        <BigButton danger onClick={onRemoveSection}>
          Delete this whole stripe
        </BigButton>
      </Shell>
    )
  }

  if (selection.type === 'block' && block) {
    const spec = BLOCK_TYPES[block.type]
    const controls = BLOCK_CONTROLS[block.type] ?? []

    return (
      <Shell title={spec?.label ?? block.type} history={history}>
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

        <Divider />
        <BigButton danger onClick={onRemoveBlock}>
          Delete this
        </BigButton>
      </Shell>
    )
  }

  return null
}





/** Read "background.overlay" out of an object. */
function readPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
