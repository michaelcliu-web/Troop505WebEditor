import { token } from './schema'

/*
  The navigation bar.

  Note that this is driven by SITE data, not PAGE data — the nav is the same on every page,
  so it lives one level up. Its tabs are generated from the list of pages, which means
  "add a page" in the editor automatically adds a tab. That's the multipage capability the
  current troop505.org is missing entirely.

  Thin and square, like the BSA site.
*/
export default function SiteHeader({ site, currentSlug, onNavigate }) {
  const { title, nav, pages } = site

  return (
    <header className={`sticky top-0 z-50 w-full ${token('bgColor', nav.bgColor, 'bg-[var(--color-forest)]')}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <span className="font-[family-name:var(--font-heading)] text-lg font-extrabold tracking-tight text-[var(--color-cream)]">
          {title}
        </span>

        <nav className="flex flex-wrap items-center gap-1">
          {pages.map((page) => {
            const isActive = page.slug === currentSlug
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onNavigate(page.slug)}
                className={`cursor-pointer border-0 bg-transparent px-3 py-2 font-[family-name:var(--font-body)] text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-ember-bright)]'
                    : 'text-[var(--color-cream)]/85 hover:text-[var(--color-cream)]'
                }`}
              >
                {page.title}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
