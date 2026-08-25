import { token } from '../schema'

export default function GalleryBlock({ props }) {
  const { images, columns, gap, radius } = props

  if (!images?.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[var(--color-dusk)]/30 bg-[var(--color-parchment)] p-10 text-center text-sm text-[var(--color-dusk)]">
        No photos in this gallery yet
      </div>
    )
  }

  return (
    <div className={`grid ${token('columns', columns)} ${token('gap', gap)}`}>
      {images.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt={img.alt || ''}
          loading="lazy"
          className={`aspect-square w-full object-cover ${token('radius', radius)}`}
        />
      ))}
    </div>
  )
}
