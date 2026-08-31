import { useEffect, useRef, useState } from 'react'
import { BLOCK_CONTROLS } from './controls'

/*
  The floating toolbar above a selected block — the Google Docs / Squarespace pattern.

  POSITIONING: rendered INSIDE the selected block's wrapper, which is `relative`. So
  `absolute -top-12` puts it just above that block and it follows the block around
  automatically. No pixel measuring anywhere.

  ONE HONEST LIMITATION: formatting applies to the WHOLE block, not to the words you
  have selected. Bold makes the entire heading bold. Per-word formatting means storing
  text as a structure (which words carry which marks) instead of a plain string, plus a
  matching editor — a genuinely large change, not a tweak.
*/

const TEXT_COLORS = [
  { value: 'bark', label: 'Dark brown', css: 'var(--color-bark)' },
  { value: 'forest', label: 'Green', css: 'var(--color-forest)' },
  { value: 'ember', label: 'Orange', css: 'var(--color-ember)' },
  { value: 'dusk', label: 'Grey', css: 'var(--color-dusk)' },
  { value: 'cream', label: 'Cream', css: 'var(--color-cream)' },
]

const HIGHLIGHTS = [
  { value: 'none', label: 'No highlight', css: 'transparent' },
  { value: 'yellow', label: 'Yellow', css: '#fef08a' },
  { value: 'green', label: 'Green', css: '#bbf7d0' },
  { value: 'pink', label: 'Pink', css: '#fbcfe8' },
  { value: 'blue', label: 'Blue', css: '#bfdbfe' },
]

export default function BlockToolbar({ block, onChangeProp, onDelete, onUndo, canUndo }) {
  const [openMenu, setOpenMenu] = useState(null) // 'color' | 'highlight' | 'link' | null
  const toolbarRef = useRef(null)

  // Clicking anywhere else closes an open popover.
  useEffect(() => {
    function onDown(e) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) setOpenMenu(null)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [])

  const isText = block.type === 'text'
  const p = block.props
  const currentColor = TEXT_COLORS.find((c) => c.value === p.color) ?? TEXT_COLORS[0]

  return (
    <div
      ref={toolbarRef}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()} // never start a drag from the toolbar
      className="absolute -top-12 left-0 z-40 flex items-center gap-0.5 rounded-lg border border-stone-300 bg-white px-1.5 py-1 shadow-lg"
    >
      {isText ? (
        <>
          <Picker
            title="Kind of text"
            value={p.tag}
            onChange={(v) => onChangeProp('tag', v)}
            options={[
              { value: 'h1', label: 'Title' },
              { value: 'h2', label: 'Heading' },
              { value: 'h3', label: 'Subheading' },
              { value: 'p', label: 'Normal text' },
            ]}
          />
          <Picker
            title="Size"
            value={p.size}
            onChange={(v) => onChangeProp('size', v)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Normal' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'X-Large' },
              { value: '2xl', label: 'Huge' },
            ]}
          />

          <Divider />

          <IconButton
            title="Bold"
            active={p.weight === 'bold'}
            onClick={() => onChangeProp('weight', p.weight === 'bold' ? 'normal' : 'bold')}
          >
            <span className="font-bold">B</span>
          </IconButton>

          <IconButton
            title="Italic"
            active={!!p.italic}
            onClick={() => onChangeProp('italic', !p.italic)}
          >
            <span className="font-serif italic">I</span>
          </IconButton>

          <IconButton
            title="Underline"
            active={!!p.underline}
            onClick={() => onChangeProp('underline', !p.underline)}
          >
            <span className="underline underline-offset-2">U</span>
          </IconButton>

          {/* Text colour: an A over a bar showing the current colour. */}
          <Popover
            title="Text colour"
            open={openMenu === 'color'}
            onToggle={() => setOpenMenu(openMenu === 'color' ? null : 'color')}
            button={
              <span className="flex flex-col items-center leading-none">
                <span className="text-[13px] font-semibold">A</span>
                <span
                  className="mt-0.5 h-1 w-3.5 rounded-sm border border-stone-300"
                  style={{ background: currentColor.css }}
                />
              </span>
            }
          >
            <Swatches
              options={TEXT_COLORS}
              value={p.color}
              onPick={(v) => {
                onChangeProp('color', v)
                setOpenMenu(null)
              }}
            />
          </Popover>

          {/* Highlight: a marker pen. */}
          <Popover
            title="Highlight"
            open={openMenu === 'highlight'}
            onToggle={() => setOpenMenu(openMenu === 'highlight' ? null : 'highlight')}
            button={<PenIcon />}
          >
            <Swatches
              options={HIGHLIGHTS}
              value={p.highlight}
              onPick={(v) => {
                onChangeProp('highlight', v)
                setOpenMenu(null)
              }}
            />
          </Popover>

          <Popover
            title="Link"
            open={openMenu === 'link'}
            onToggle={() => setOpenMenu(openMenu === 'link' ? null : 'link')}
            button={<LinkIcon />}
            active={!!p.href}
          >
            <div className="flex w-64 flex-col gap-2">
              <input
                autoFocus
                type="text"
                placeholder="https://..."
                defaultValue={p.href}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onChangeProp('href', e.currentTarget.value.trim())
                    setOpenMenu(null)
                  }
                }}
                className="w-full rounded border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-[var(--color-ember)]"
              />
              <div className="flex gap-2">
                <MiniButton
                  onClick={(e) => {
                    const input = e.currentTarget.closest('div').parentElement.querySelector('input')
                    onChangeProp('href', input.value.trim())
                    setOpenMenu(null)
                  }}
                >
                  Apply
                </MiniButton>
                {p.href && (
                  <MiniButton
                    onClick={() => {
                      onChangeProp('href', '')
                      setOpenMenu(null)
                    }}
                  >
                    Remove
                  </MiniButton>
                )}
              </div>
            </div>
          </Popover>

          <Divider />

          <IconButton
            title="Align left"
            active={p.align === 'left'}
            onClick={() => onChangeProp('align', 'left')}
          >
            <AlignIcon which="left" />
          </IconButton>
          <IconButton
            title="Align centre"
            active={p.align === 'center'}
            onClick={() => onChangeProp('align', 'center')}
          >
            <AlignIcon which="center" />
          </IconButton>
          <IconButton
            title="Align right"
            active={p.align === 'right'}
            onClick={() => onChangeProp('align', 'right')}
          >
            <AlignIcon which="right" />
          </IconButton>

          <Divider />

          <IconButton
            title="Bulleted list (one item per line)"
            active={p.list === 'bullet'}
            onClick={() => onChangeProp('list', p.list === 'bullet' ? 'none' : 'bullet')}
          >
            <ListIcon numbered={false} />
          </IconButton>
          <IconButton
            title="Numbered list (one item per line)"
            active={p.list === 'number'}
            onClick={() => onChangeProp('list', p.list === 'number' ? 'none' : 'number')}
          >
            <ListIcon numbered />
          </IconButton>
        </>
      ) : (
        // Non-text blocks keep the simple generated controls.
        (BLOCK_CONTROLS[block.type] ?? [])
          .filter((c) => c.quick)
          .map((control) => (
            <Picker
              key={control.key}
              title={control.label}
              value={block.props[control.key]}
              onChange={(v) => onChangeProp(control.key, v)}
              options={control.options}
            />
          ))
      )}

      <Divider />

      <IconButton title="Undo" onClick={onUndo} disabled={!canUndo}>
        <UndoIcon />
      </IconButton>
      <IconButton title="Delete this" onClick={onDelete} danger>
        <TrashIcon />
      </IconButton>
    </div>
  )
}

/* ── small pieces ─────────────────────────────────────────────── */

function IconButton({ children, title, onClick, active, disabled, danger }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 text-[13px] transition-colors ${
        danger
          ? 'bg-transparent text-red-600 hover:bg-red-50'
          : active
            ? 'bg-stone-200 text-stone-900'
            : 'bg-transparent text-stone-700 hover:bg-stone-100'
      } disabled:cursor-default disabled:text-stone-300 disabled:hover:bg-transparent`}
    >
      {children}
    </button>
  )
}

function Picker({ title, value, onChange, options }) {
  return (
    <select
      title={title}
      value={value ?? ''}
      onChange={(e) => {
        const match = options.find((o) => String(o.value) === e.target.value)
        onChange(match ? match.value : e.target.value)
      }}
      className="h-7 cursor-pointer rounded border border-stone-200 bg-white px-1.5 text-xs text-stone-800 outline-none hover:bg-stone-50"
    >
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Popover({ title, open, onToggle, button, children, active }) {
  return (
    <span className="relative">
      <IconButton title={title} onClick={onToggle} active={open || active}>
        {button}
      </IconButton>
      {open && (
        <div className="absolute top-9 left-0 z-50 rounded-lg border border-stone-300 bg-white p-2 shadow-lg">
          {children}
        </div>
      )}
    </span>
  )
}

function Swatches({ options, value, onPick }) {
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.label}
          onClick={() => onPick(o.value)}
          style={{ background: o.css }}
          className={`h-6 w-6 cursor-pointer rounded-full border transition-transform hover:scale-110 ${
            value === o.value ? 'border-2 border-stone-900' : 'border-stone-300'
          }`}
        />
      ))}
    </div>
  )
}

function MiniButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-800 hover:bg-stone-100"
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-stone-200" />
}

/* ── icons, drawn inline so there is no icon library to load ──── */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function AlignIcon({ which }) {
  const lines = {
    left: [14, 9, 14, 9],
    center: [14, 10, 14, 10],
    right: [14, 9, 14, 9],
  }[which]
  const xFor = (len, i) =>
    which === 'left' ? 1 : which === 'right' ? 15 - len : (16 - len) / 2 + (i % 2 ? 0 : 0)
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      {lines.map((len, i) => (
        <line key={i} x1={xFor(len, i)} y1={3 + i * 3.2} x2={xFor(len, i) + len} y2={3 + i * 3.2} />
      ))}
    </svg>
  )
}

function ListIcon({ numbered }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      <line x1="6" y1="4" x2="14" y2="4" />
      <line x1="6" y1="8" x2="14" y2="8" />
      <line x1="6" y1="12" x2="14" y2="12" />
      {numbered ? (
        <>
          <line x1="2" y1="3" x2="2" y2="5.5" />
          <line x1="1.2" y1="8" x2="3" y2="8" />
          <line x1="1.2" y1="12" x2="3" y2="12" />
        </>
      ) : (
        <>
          <circle cx="2.2" cy="4" r="1" fill="currentColor" stroke="none" />
          <circle cx="2.2" cy="8" r="1" fill="currentColor" stroke="none" />
          <circle cx="2.2" cy="12" r="1" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      <path d="M6.5 9.5a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.8.8" />
      <path d="M9.5 6.5a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.8-.8" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      <path d="M9.5 2.5 13 6l-5.5 5.5H4V8z" />
      <line x1="2.5" y1="14" x2="13.5" y2="14" strokeWidth="2.2" />
    </svg>
  )
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      <path d="M3 7h7a3.5 3.5 0 0 1 0 7H7" />
      <polyline points="5.5,4.5 3,7 5.5,9.5" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
      <path d="M3 4.5h10" />
      <path d="M6 4.5V3h4v1.5" />
      <path d="M4.5 4.5 5 13h6l.5-8.5" />
    </svg>
  )
}
