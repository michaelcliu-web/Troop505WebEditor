import { Renderer } from './renderer.js'

// ── the state: the whole site, in one object ──

let site = {
  sections: [
    {
      background: 'ember',
      rows: [
        { blocks: [{ type: 'text', props: { content: 'Michael', size: '2xl', color: 'cream' } }] },
        { blocks: [{ type: 'image', props: { src: 'camp.jpg' } }] },
      ],
    },
  ],
}

let previousScreen = null

// ── setSite: takes a function, calls it with the current site,
//    stores the result, then redraws ──

function setSite(makeNewSite) {
  site = makeNewSite(site)
  draw()
}

function draw() {
  const newScreen = Renderer(site)

  if (previousScreen === null) {
    console.log('FIRST DRAW — building everything:')
    console.log('  ' + newScreen)
  } else if (newScreen === previousScreen) {
    console.log('nothing changed, browser untouched')
  } else {
    console.log('CHANGED:')
    console.log('  before: ' + previousScreen)
    console.log('  after:  ' + newScreen)
  }

  previousScreen = newScreen
}

// ── run it ──

draw()

console.log('\n--- user picks green in the dropdown ---')
setSite((current) => ({
  ...current,
  sections: current.sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      blocks: row.blocks.map((block) =>
        block.type === 'text' ? { ...block, props: { ...block.props, color: 'forest' } } : block,
      ),
    })),
  })),
}))

console.log('\n--- user clicks something but changes nothing ---')
setSite((current) => ({ ...current }))
