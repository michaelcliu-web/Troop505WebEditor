import { BLOCK_COMPONENTS } from './blocks'
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
*/

function Block({ block }) {
  const Component = BLOCK_COMPONENTS[block.type]

  // Unknown type: don't crash the whole page. This happens if a page was saved by a newer
  // version of the app than the one currently running.
  if (!Component) {
    return (
      <div className="rounded-lg bg-[var(--color-parchment)] p-4 text-sm text-[var(--color-dusk)]">
        Can&apos;t show this yet ({block.type})
      </div>
    )
  }

  return <Component props={block.props} />
}

function Row({ row }) {
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
          <Block block={block} />
        </div>
      ))}
    </div>
  )
}

function Section({ section }) {
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

  return (
    <section className={`relative w-full ${colorClass}`} style={style}>
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
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Renderer({ page }) {
  if (!page) return null

  return (
    <main>
      {page.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </main>
  )
}
