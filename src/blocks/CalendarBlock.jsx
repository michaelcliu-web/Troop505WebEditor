/*
  The auto-updating schedule.

  Deliberately NOT web scraping — that breaks whenever the source site changes and raises
  terms-of-service questions. Instead this embeds a Google Calendar the troop already keeps.

  Important: point this at a SEPARATE PUBLIC calendar, not the troop's main one. Then
  scout-only events simply aren't in the feed — privacy comes from which calendar is used,
  not from filtering we have to get right.
*/
export default function CalendarBlock({ props }) {
  const { embedUrl, height } = props

  if (!embedUrl) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[var(--color-dusk)]/30 bg-[var(--color-parchment)] p-10 text-center text-sm text-[var(--color-dusk)]">
        No calendar connected yet
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      title="Upcoming events"
      style={{ height: `${height || 500}px` }}
      className="w-full rounded-xl border-0 bg-white"
    />
  )
}
