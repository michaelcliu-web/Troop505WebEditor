import { BLOCK_COMPONENTS } from './blocks'
import BlockToolbar from './edit/BlockToolbar'
import { token } from './schema'

/*
  THE RENDERER — the heart of the whole project.

  It walks the page data top to bottom:

      Page  →  Section  →  Row  →  Block

  ...and at the very bottom, looks up which component draws each block. That's it. There is no
  HTML for "the homepage" anywhere in this codebase, because there is no such thing as "the
  homepage" — there is only data, and this function that draws whatever data it's handed.

  This is why the editor is possible. The editor never generates markup; it just changes the
  data, and React re-runs this code to redraw the screen.

  EDIT MODE: the same renderer draws both the public site and the editing canvas. When `editing`
  is true it adds click targets and outlines — but the layout is identical, so what a leader
  sees while editing is exactly what visitors get. Two separate renderers would inevitably
  drift apart.
*/

function Block({ block, editing, selectedId, onSelect, onChangeProp, onDelete }) {
  const Component = BLOCK_COMPONENTS[block.type]
  const isSelected = selectedId === block.id

  // Unknown type: don't crash the whole page. This happens if a page was saved by a newer
  // version of the app than the one currently running.
  const content = Component ? (
    <Component
      props={block.props}
      // Only the selected block, only in edit mode, can be typed into.
      // Blocks that don't support typing simply ignore these two props.
      editable={editing && isSelected}
      onChangeContent={(text) => onChangeProp('content', text)}
    />
  ) : (
    <div className="rounded-lg bg-[var(--color-parchment)] p-4 text-sm text-[var(--color-dusk)]">
      Can&apos;t show this yet ({block.type})
    </div>
  )

  if (!editing) return content

  return (
    <div
      onClick={(e) => {
        // Without this, the click would also reach the section behind and select that instead.
        e.stopPropagation()
        onSelect({ type: 'block', id: block.id })
      }}
      className={`relative cursor-pointer rounded-lg outline-offset-4 transition-all ${
        isSelected
          ? 'outline outline-2 outline-blue-500'
          : 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-400/60'
      }`}
    >
      {/*
        The floating toolbar. It lives inside this wrapper, which is `relative`,
        so it positions itself against THIS block and follows it around.
        Editor-only: it is never part of the page data, so visitors never see it.
      */}
      {isSelected && (
        <BlockToolbar block={block} onChangeProp={onChangeProp} onDelete={onDelete} />
      )}
      {content}
    </div>
  )
}

function Row({ row, editing, selectedId, onSelect, onChangeProp, onDelete }) {
  return (
    <div
      className={`flex flex-col sm:flex-row ${token('gap', row.gap)} ${token('rowAlign', row.align)}`}
    >
      {row.blocks.map((block) => (
        /*
          `key` is React's way of tracking which item is which across redraws. Using the block's
          stable id (not its position) is what makes drag-and-drop work later without React
          getting confused about what moved.

          On phones the row becomes a vertical stack (flex-col above), and each block goes
          full width — that's the responsive behavior we get for free by NOT doing freeform
          pixel positioning.
        */
        <div key={block.id} className="w-full" style={{ flexBasis: `${block.width}%` }}>
          <Block
            block={block}
            editing={editing}
            selectedId={selectedId}
            onSelect={onSelect}
            onChangeProp={onChangeProp}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}

function Section({ section, editing, selectedId, onSelect, onChangeProp, onDelete }) {
  const { background, padding, maxWidth, rows } = section
  const isImage = background?.type === 'image' && background.value

  /*
    Background images are a first-class feature here, not an afterthought — the current troop
    sites don't have them, and they're most of what makes a page feel warm instead of clerical.

    The `overlay` darkens the photo behind the text. Without it, light text over a bright photo
    becomes unreadable — a very common way homemade sites go wrong.
  */
  const style = isImage
    ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  const colorClass = !isImage ? token('bgColor', background?.value, 'bg-[var(--color-cream)]') : ''
  const isSelected = selectedId === section.id

  return (
    <section
      onClick={
        editing
          ? (e) => {
              // Same reason as the block above: without this the click keeps travelling
              // outward to the canvas, which would clear the selection we just made.
              e.stopPropagation()
              onSelect({ type: 'section', id: section.id })
            }
          : undefined
      }
      className={`relative w-full ${colorClass} ${
        editing
          ? `cursor-pointer -outline-offset-2 ${
              isSelected ? 'outline outline-2 outline-blue-500' : ''
            }`
          : ''
      }`}
      style={style}
    >
      {isImage && background.overlay > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: background.overlay }}
          aria-hidden="true"
        />
      )}
      <div
        className={`relative mx-auto w-full px-5 sm:px-8 ${token('maxWidth', maxWidth)} ${token('padding', padding)}`}
      >
        <div className="flex flex-col gap-8">
          {rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              editing={editing}
              selectedId={selectedId}
              onSelect={onSelect}
              onChangeProp={onChangeProp}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Renderer({
  page,
  editing = false,
  selectedId = null,
  onSelect = () => {},
  onChangeProp = () => {},
  onDelete = () => {},
}) {
  if (!page) return null

  return (
    <main>
      {page.sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          editing={editing}
          selectedId={selectedId}
          onSelect={onSelect}
          onChangeProp={onChangeProp}
          onDelete={onDelete}
        />
      ))}
    </main>
  )
}
