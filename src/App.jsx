import { useEffect, useState } from 'react'
import Renderer from './Renderer'
import SiteHeader from './SiteHeader'
import { makeBlock, makeRow, makeSection } from './schema'
import { fixtureSite } from './data/fixture'
import PropertiesPanel from './edit/PropertiesPanel'
import useHistory from './state/useHistory'
import {
  addBlockToSection,
  addSectionToPage,
  deleteBlock,
  deleteSection,
  findBlock,
  findSection,
  updateBlock,
  updateBlockProps,
  updateSection,
  updateSectionBackground,
} from './state/pageOps'

/*
  Day 2: the site now lives in STATE.

  That one word is the whole difference from Day 1. Before, `site` was a fixed import that
  nothing could change. Now it's held by `useState`, which means two things:

    1. We can replace it with a new version.
    2. When we do, React automatically redraws everything that uses it.

  Nobody tells the page to update. There is no "refresh the screen" line anywhere in this app.
  You hand React a new site object, and it works out what changed on screen.

  Not saved anywhere yet — refreshing the browser starts over. Day 4 adds the database.
*/

export default function App() {
  /*
    The site now lives in a history rather than a plain useState, so every change
    can be stepped back. `commit` replaces setSite and takes exactly the same kind
    of function: (currentSite) => newSite
  */
  const { site, commit, undo, redo, canUndo, canRedo } = useHistory(fixtureSite)
  const [currentSlug, setCurrentSlug] = useState(fixtureSite.pages[0].slug)
  const [editing, setEditing] = useState(true)
  const [selection, setSelection] = useState(null) // { type: 'block'|'section', id }

  const page = site.pages.find((p) => p.slug === currentSlug) ?? site.pages[0]

  /*
    Escape deselects. Sections cover the whole canvas, so there is no "empty space" left to
    click on to get out of a selection — the keyboard is the way out.
  */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setSelection(null)

      // Cmd-Z to undo, Cmd-Shift-Z to redo (Ctrl on Windows).
      const holdingCommand = e.metaKey || e.ctrlKey
      if (holdingCommand && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const selectedBlock = selection?.type === 'block' ? findBlock(site, selection.id) : null
  const selectedSection = selection?.type === 'section' ? findSection(site, selection.id) : null

  /*
    Each of these takes the current site, builds a NEW site with one thing changed, and hands
    it to commit. Every edit in the whole app funnels through these three functions.
  */
  function changeBlockProp(key, value) {
    /*
      The mergeKey is what stops a burst of typing becoming 40 undo steps. Rapid changes
      to the same field of the same block collapse into one. Changing a dropdown passes
      no key, so it always gets its own step.
    */
    const mergeKey = key === 'content' ? `content:${selection.id}` : null
    commit((current) => updateBlockProps(current, selection.id, { [key]: value }), mergeKey)
  }

  function changeBlockWidth(width) {
    commit((current) => updateBlock(current, selection.id, { width }))
  }

  function changeSection(path, value) {
    commit((current) =>
      path.startsWith('background.')
        ? updateSectionBackground(current, selection.id, { [path.slice('background.'.length)]: value })
        : updateSection(current, selection.id, { [path]: value }),
    )
  }

  /*
    Adding and removing. Same shape as the change functions above: build a new
    site with one thing added or gone, hand it to commit, React redraws.

    The make* functions come from schema.js and build a correctly-shaped new item.
    The add and delete functions come from pageOps.js and put it in (or take it out).
  */
  function addBlock(type) {
    commit((current) => addBlockToSection(current, selection.id, makeBlock(type)))
  }

  function removeBlock() {
    commit((current) => deleteBlock(current, selection.id))
    setSelection(null) // the thing we were pointing at is gone
  }

  function addSection() {
    const fresh = makeSection([makeRow([makeBlock('text', { content: 'New stripe' })])])
    commit((current) => addSectionToPage(current, currentSlug, fresh))
    setSelection({ type: 'section', id: fresh.id }) // select it so it can be styled right away
  }

  function removeSection() {
    commit((current) => deleteSection(current, selection.id))
    setSelection(null)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorBar
        editing={editing}
        onToggle={() => {
          setEditing((e) => !e)
          setSelection(null)
        }}
      />

      <div className="flex min-h-0 flex-1">
        {/* The page itself — the same Renderer that draws the public site. */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <SiteHeader site={site} currentSlug={currentSlug} onNavigate={setCurrentSlug} />
          <Renderer
            page={page}
            editing={editing}
            selectedId={selection?.id ?? null}
            onSelect={setSelection}
            onChangeProp={changeBlockProp}
            onDelete={removeBlock}
            onUndo={undo}
            canUndo={canUndo}
          />
          <footer className="bg-[var(--color-forest-deep)] px-5 py-10 text-center text-sm text-[var(--color-cream)]/70">
            Scaffolding — showing throwaway placeholder content
          </footer>
        </div>

        {editing && (
          <PropertiesPanel
            selection={selection}
            block={selectedBlock}
            section={selectedSection}
            onChangeBlockProp={changeBlockProp}
            onChangeBlockWidth={changeBlockWidth}
            onChangeSection={changeSection}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
      </div>
    </div>
  )
}

/*
  Minimal chrome, on purpose: one button. The UX target is a non-technical scoutmaster, and
  every extra control is one more thing to be afraid of.
*/
function EditorBar({ editing, onToggle }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5 py-3">
      <span className="text-sm font-semibold text-stone-500">
        {editing ? 'You are editing this page' : 'This is how visitors see it'}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer rounded-full border-0 bg-[var(--color-ember)] px-6 py-2.5 font-[family-name:var(--font-heading)] text-sm font-bold text-white transition-colors hover:bg-[var(--color-ember-bright)]"
      >
        {editing ? 'Preview' : 'Edit'}
      </button>
    </div>
  )
}
