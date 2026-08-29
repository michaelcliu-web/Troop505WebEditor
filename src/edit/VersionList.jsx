import { BigButton, Divider, Shell } from './PanelShell'

/*
  The version history view. Click a version to see the page as it was; then either
  restore it or go back to editing. Previewing changes nothing — it only shows a
  saved site instead of the current one.
*/

function clockTime(ms) {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function VersionList({
  versions,
  previewing,
  onPreview,
  onRestore,
  onStopPreview,
  onSaveNow,
  onBack,
}) {
  if (previewing) {
    return (
      <Shell title="Looking at an old version" subtitle={`${previewing.label} · ${clockTime(previewing.time)}`}>
        <p className="text-sm leading-relaxed text-stone-600">
          This is how the site looked then. Nothing has changed yet.
        </p>
        <BigButton onClick={() => onRestore(previewing)}>Put the site back to this</BigButton>
        <BigButton onClick={onStopPreview}>Never mind, keep editing</BigButton>
      </Shell>
    )
  }

  return (
    <Shell title="Version history" subtitle="Saved automatically as you work">
      <BigButton onClick={onSaveNow}>Save a version right now</BigButton>

      <Divider label={versions.length ? 'Earlier versions' : ''} />

      {versions.length === 0 ? (
        <p className="text-sm leading-relaxed text-stone-600">
          No versions yet. One is saved automatically every so often as you edit, and you can
          save one yourself at any time.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {versions.map((version) => (
            <button
              key={version.id}
              type="button"
              onClick={() => onPreview(version)}
              className="w-full cursor-pointer rounded-lg border border-stone-300 bg-white px-4 py-3 text-left transition-colors hover:bg-stone-100"
            >
              <span className="block text-sm font-semibold text-stone-800">{version.label}</span>
              <span className="block text-xs text-stone-500">{clockTime(version.time)}</span>
            </button>
          ))}
        </div>
      )}

      <Divider />
      <BigButton onClick={onBack}>Back to editing</BigButton>
    </Shell>
  )
}
