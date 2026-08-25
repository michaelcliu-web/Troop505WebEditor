import { token } from '../schema'

export default function ImageBlock({ props }) {
  const { src, alt, fit, aspect, radius, caption } = props

  // Before a photo is chosen, show a friendly placeholder instead of a broken image icon.
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-[var(--color-dusk)]/30 bg-[var(--color-parchment)] ${token('aspect', aspect)} ${token('radius', radius)}`}
      >
        <span className="text-sm text-[var(--color-dusk)]">No photo chosen yet</span>
      </div>
    )
  }

  return (
    <figure className="m-0">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full ${token('aspect', aspect)} ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${token('radius', radius)}`}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-[var(--color-dusk)]">{caption}</figcaption>
      )}
    </figure>
  )
}
