import { token } from '../schema'

/*
  Videos are never uploaded to our own server — hosting video is expensive and slow.
  The leader pastes a normal YouTube or Vimeo link and we convert it to an embed URL here,
  so they never have to find the "embed code".
*/
export function toEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') {
        const v = u.searchParams.get('v')
        return v ? `https://www.youtube.com/embed/${v}` : null
      }
      // Already an /embed/ or /shorts/ style link
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' || parts[0] === 'shorts') {
        return `https://www.youtube.com/embed/${parts[1]}`
      }
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null // Not a valid URL at all
  }
  return null
}

export default function VideoBlock({ props }) {
  const { url, caption, radius } = props
  const embed = toEmbedUrl(url)

  if (!embed) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[var(--color-dusk)]/30 bg-[var(--color-parchment)] p-10 text-center text-sm text-[var(--color-dusk)]">
        {url ? "That link isn't a YouTube or Vimeo video" : 'No video chosen yet'}
      </div>
    )
  }

  return (
    <figure className="m-0">
      <div className={`aspect-video w-full overflow-hidden ${token('radius', radius)}`}>
        <iframe
          src={embed}
          title={caption || 'Video'}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-[var(--color-dusk)]">{caption}</figcaption>
      )}
    </figure>
  )
}
