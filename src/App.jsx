import { useState } from 'react'
import Renderer from './Renderer'
import SiteHeader from './SiteHeader'
import { fixtureSite } from './data/fixture'

/*
  Day 1: the site data is a fixed import and nothing can change it yet.

  The ONLY state here is which page is showing. On Day 2 the site itself moves into state,
  and the properties panel starts changing it — at which point the screen updates by itself,
  because React redraws whenever state changes.
*/
export default function App() {
  const site = fixtureSite
  const [currentSlug, setCurrentSlug] = useState(site.pages[0].slug)

  const page = site.pages.find((p) => p.slug === currentSlug) ?? site.pages[0]

  return (
    <>
      <SiteHeader site={site} currentSlug={currentSlug} onNavigate={setCurrentSlug} />
      <Renderer page={page} />
      <footer className="bg-[var(--color-forest-deep)] px-5 py-10 text-center text-sm text-[var(--color-cream)]/70">
        Scaffolding — showing throwaway placeholder content
      </footer>
    </>
  )
}
