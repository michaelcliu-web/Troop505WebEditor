import { token } from '../schema'

/*
  Turns text props into markup. Note how little this knows: it doesn't know what page it's on,
  or what's above or below it. Every block component is like this — it only sees its own props.
  That's what makes them reusable on any page the editor builds.
*/
export default function TextBlock({ props }) {
  const { content, tag, align, font, size, color, weight } = props

  // `tag` picks the real HTML element (h1/h2/h3/p) — this matters for screen readers and SEO,
  // separately from how big the text looks.
  const Tag = ['h1', 'h2', 'h3', 'p'].includes(tag) ? tag : 'p'

  const className = [
    token('textSize', size),
    token('textAlign', align),
    token('fontFamily', font),
    token('fontWeight', weight),
    token('textColor', color),
    'whitespace-pre-wrap leading-relaxed',
  ].join(' ')

  return <Tag className={className}>{content}</Tag>
}
