import { BLOCK_CONTROLS } from './controls'

/*
  The floating toolbar that appears above a selected block — the Squarespace /
  Google Docs pattern.

  The positioning trick: this is rendered INSIDE the selected block's wrapper,
  which is `relative`. So `absolute -top-11` places it just above that block,
  and it follows the block automatically when the page scrolls, the window
  resizes, or the layout shifts. No pixel measuring anywhere.

  It shows only the controls marked `quick: true` in controls.js. Everything
  else stays in the side panel.
*/

export default function BlockToolbar({ block, onChangeProp, onDelete }) {
  const quick = (BLOCK_CONTROLS[block.type] ?? []).filter((c) => c.quick)

  return (
    <div
      // Clicks in here must not reach the block underneath, or the page behind.
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-11 left-0 z-40 flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-1.5 py-1 shadow-lg"
    >
      {quick.map((control) => (
        <select
          key={control.key}
          title={control.label}
          value={block.props[control.key] ?? ''}
          onChange={(e) => {
            const match = control.options.find((o) => String(o.value) === e.target.value)
            onChangeProp(control.key, match ? match.value : e.target.value)
          }}
          className="cursor-pointer rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-800 outline-none hover:bg-stone-50"
        >
          {control.options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      ))}

      {quick.length > 0 && <span className="mx-0.5 h-5 w-px bg-stone-200" />}

      <button
        type="button"
        title="Delete this"
        onClick={onDelete}
        className="cursor-pointer rounded border-0 bg-transparent px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  )
}
