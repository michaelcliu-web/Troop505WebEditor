import EditableText from '../edit/EditableText'
import { token } from '../schema'

/*
  Turns text props into markup. It only ever sees its own props — it doesn't know what page
  it's on or what's above it, which is what makes it reusable anywhere the editor puts it.

  Formatting here is per-BLOCK, not per-word. Bold makes the whole block bold. Per-word
  formatting would mean storing text as a structure rather than a plain string, which is a
  much bigger change — see the note in the toolbar.
*/
export default function TextBlock({ props, editable = false, onChangeContent }) {
  const { content, tag, align, font, size, color, weight, italic, underline, highlight, href, list } =
    props

  // `tag` picks the real HTML element (h1/h2/h3/p) — this matters for screen readers and SEO,
  // separately from how big the text looks.
  const Tag = ['h1', 'h2', 'h3', 'p'].includes(tag) ? tag : 'p'

  const className = [
    token('textSize', size),
    token('textAlign', align),
    token('fontFamily', font),
    token('fontWeight', weight),
    token('textColor', color),
    italic ? 'italic' : '',
    underline ? 'underline underline-offset-4' : '',
    'whitespace-pre-wrap leading-relaxed',
  ]
    .filter(Boolean)
    .join(' ')

  const highlightClass = token('highlight', highlight)

  // Bullet or numbered list: one item per line of the text.
  if (list === 'bullet' || list === 'number') {
    const ListTag = list === 'bullet' ? 'ul' : 'ol'
    const items = String(content ?? '')
      .split('\n')
      .filter((line) => line.trim().length > 0)

    return wrapInLink(
      href,
      <ListTag
        className={`${className} ${list === 'bullet' ? 'list-disc' : 'list-decimal'} list-inside`}
      >
        {items.map((line, i) => (
          <li key={i}>{highlightClass ? <mark className={`${highlightClass} text-inherit`}>{line}</mark> : line}</li>
        ))}
      </ListTag>,
    )
  }

  if (editable) {
    /*
      While typing, the highlight is painted on the element itself rather than on a <mark>
      around the words. A <mark> would be a separate node inside the editable area, and the
      browser would let you type outside it. Slightly wider band, but the feedback is there.
    */
    return (
      <EditableText
        tag={Tag}
        className={`${className} ${highlightClass}`}
        value={content}
        onChange={onChangeContent}
      />
    )
  }

  return wrapInLink(
    href,
    <Tag className={className}>
      {highlightClass ? (
        // A span rather than the whole block, so the highlight hugs the words.
        <mark className={`${highlightClass} box-decoration-clone px-1 text-inherit`}>{content}</mark>
      ) : (
        content
      )}
    </Tag>,
  )
}

/** Wraps the block in a link when one is set. No link, no extra element. */
function wrapInLink(href, element) {
  if (!href) return element
  return (
    <a href={href} className="no-underline">
      {element}
    </a>
  )
}
