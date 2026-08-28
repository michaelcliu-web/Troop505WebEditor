/*
  NOT PART OF THE APP. Reading material only — nothing imports this file.

  Two stripped-down versions of App.jsx, smallest first.
*/

// ─────────────────────────────────────────────────────────────
// VERSION 1 — the smallest thing that shows state ownership
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'

function Display({ text }) {
  return <h1>{text}</h1>
}

function Editor({ text, onChange }) {
  return <input value={text} onChange={(e) => onChange(e.target.value)} />
}

export function TinyApp() {
  const [text, setText] = useState('Hello')

  return (
    <div>
      <Display text={text} />
      <Editor text={text} onChange={setText} />
    </div>
  )
}

/*
  That is the entire idea.

  - TinyApp OWNS `text`. Display and Editor do not.
  - Both children receive it as a prop. Neither can change it.
  - Editor reports upward by calling onChange.
  - setText replaces the value, React re-runs TinyApp, both children get the new text.

  Display and Editor are siblings and cannot talk to each other. The state sits in
  the nearest parent containing both. That is the whole reason it lives in App.
*/


// ─────────────────────────────────────────────────────────────
// VERSION 2 — the real App.jsx, styling and extras removed
// ─────────────────────────────────────────────────────────────

import Renderer from '../src/Renderer'
import { fixtureSite } from '../src/data/fixture'
import PropertiesPanel from '../src/edit/PropertiesPanel'
import { findBlock, updateBlockProps } from '../src/state/pageOps'

export function App() {
  const [site, setSite] = useState(fixtureSite)
  const [selection, setSelection] = useState(null)

  const page = site.pages[0]
  const selectedBlock = selection ? findBlock(site, selection.id) : null

  function changeBlockProp(key, value) {
    setSite((current) => updateBlockProps(current, selection.id, { [key]: value }))
  }

  return (
    <div>
      <Renderer
        page={page}
        editing={true}
        selectedId={selection?.id ?? null}
        onSelect={setSelection}
      />

      <PropertiesPanel
        selection={selection}
        block={selectedBlock}
        onChangeBlockProp={changeBlockProp}
      />
    </div>
  )
}

/*
  Same three parts as TinyApp:

    1. useState        the memory
    2. changeBlockProp the one way to change it
    3. props down, functions up

  What the real file adds, all of it optional:

    currentSlug / editing    two more useState calls, same pattern
    useEffect                Escape key listener
    changeBlockWidth         another change function, same shape
    changeSection            another change function, same shape
    EditorBar                the Edit/Preview button
    className=".."           styling only, zero logic
*/
