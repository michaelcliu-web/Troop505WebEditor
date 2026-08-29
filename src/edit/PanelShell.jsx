/*
  The shared frame for the sidebar, used by both the properties panel and the
  version history. Keeping it in one file means the two can't drift apart visually.
*/

export function Shell({ title, subtitle, history, children }) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-stone-200 bg-stone-50">
      {history && (
        <div className="flex gap-2 border-b border-stone-200 px-5 py-3">
          <SmallButton onClick={history.onUndo} disabled={!history.canUndo}>
            Undo
          </SmallButton>
          <SmallButton onClick={history.onRedo} disabled={!history.canRedo}>
            Redo
          </SmallButton>
          <SmallButton onClick={history.onShowVersions}>Versions</SmallButton>
        </div>
      )}
      <div className="border-b border-stone-200 px-5 py-4">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-stone-900">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">{children}</div>
    </aside>
  )
}

export function SmallButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 disabled:cursor-default disabled:border-stone-200 disabled:text-stone-300 disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}

/*
  Big, plainly-worded buttons — the UX target is a non-technical scoutmaster,
  not a designer hunting for small icons.
*/
export function BigButton({ children, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
        danger
          ? 'border-red-200 bg-white text-red-700 hover:bg-red-50'
          : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
      }`}
    >
      {children}
    </button>
  )
}

export function Divider({ label }) {
  return (
    <div className="border-t border-stone-200 pt-4">
      {label && <p className="mb-2 text-xs font-semibold text-stone-500">{label}</p>}
    </div>
  )
}
