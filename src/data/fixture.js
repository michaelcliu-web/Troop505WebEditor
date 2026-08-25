/*
  ============================================================================
  THROWAWAY TEST DATA — NOT THE REAL SITE. DELETE ME.
  ============================================================================

  This exists for one reason: the renderer needs something to draw before the editor exists.
  You can't build a GUI that outputs a format you've never once seen rendered on screen.

  The real Troop 505 site gets built IN THE EDITOR, not here. Nobody should ever hand-write a
  page — avoiding exactly that is the entire point of this project.

  So this file is deliberately generic filler that exercises every block type. When the editor
  works (Day 5), delete this file.
*/

import { makeBlock, makePage, makeRow, makeSection } from '../schema'

const photo = (seed) => `https://picsum.photos/seed/${seed}/900/700`

function mikeSection() { 
  const section = makeSection([
    makeRow([
      makeBlock(
        'text', { 
          content: "Yale",
          size: '4xl',
          font: 'heading',
          weight: 'bold', 
          color: 'cream',
          align: 'center', 
        }
      )
    ]),
    makeRow([
      makeBlock(
        'text', { 
          content: "Yale",
          size: '4xl',
          font: 'heading',
          weight: 'bold', 
          color: 'cream',
          align: 'center', 
        }
      )
    ])
  ]
  )
  // Orange is called 'ember'. Valid colors: cream, parchment, forest, forest-deep, ember, bark.
  // These are case-sensitive, and `overlay` only does anything when type is 'image'.
  section.background = { type: 'color', value: 'ember', overlay: 0 }
  // Without this line the function hands back `undefined`, which lands in the sections
  // list and crashes the renderer. Every section-building function must return its section.
  return section
}

function heroSection() {
  const section = makeSection([
    makeRow([
      makeBlock('text', {
        content: 'Michael',
        tag: 'h1',
        size: '2xl',
        font: 'heading',
        weight: 'bold',
        color: 'cream',
        align: 'center',
      }),
    ]),
    makeRow([
      makeBlock('text', {
        content: 'A key that says content leads here ',
        size: 'lg',
        color: 'cream',
        align: 'center',
      }),
    ]),
    makeRow([makeBlock('button', { label: 'Primary Action', align: 'center', size: 'lg' })]),
  ])
  // Exercises the background-image path, including the darkening overlay.
  section.background = { type: 'image', value: photo('camp'), overlay: 0.5 }
  section.padding = 'xl'
  return section
}

function twoColumnSection() {
  const text = makeBlock('text', {
    content:
      'Lorem ipsum body copy to verify that a text block and a photo block sit side by side, and that they stack vertically on a narrow screen.',
    size: 'md',
  })
  const heading = makeBlock('text', {
    content: 'Two Column Row',
    tag: 'h2',
    size: 'xl',
    font: 'heading',
    weight: 'bold',
    color: 'forest',
  })
  const image = makeBlock('image', { src: photo('hike'), alt: '', aspect: '4/3' })

  text.width = 50
  heading.width = 100
  image.width = 50

  const section = makeSection([makeRow([heading]), makeRow([text, image])])
  section.background = { type: 'color', value: 'cream', overlay: 0 }
  return section
}

function gallerySection() {
  const heading = makeBlock('text', {
    content: 'Gallery + Video',
    tag: 'h2',
    size: 'xl',
    font: 'heading',
    weight: 'bold',
    color: 'forest',
    align: 'center',
  })
  const gallery = makeBlock('gallery', {
    columns: 3,
    images: ['a', 'b', 'c', 'd', 'e', 'f'].map((s) => ({
      id: `fix_${s}`,
      src: photo(s),
      alt: '',
    })),
  })
  const video = makeBlock('video', {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: 'Placeholder video to test the embed conversion',
  })

  const section = makeSection([makeRow([heading]), makeRow([gallery]), makeRow([video])])
  section.background = { type: 'color', value: 'parchment', overlay: 0 }
  return section
}

function emptyStateSection() {
  // Blocks with nothing filled in yet — checks that placeholders look friendly
  // rather than broken, which is what a leader sees right after adding one.
  const heading = makeBlock('text', {
    content: 'Unfilled blocks',
    tag: 'h3',
    size: 'lg',
    font: 'heading',
    weight: 'bold',
    color: 'dusk',
  })
  const emptyImage = makeBlock('image')
  const emptyCalendar = makeBlock('calendar')
  emptyImage.width = 40
  emptyCalendar.width = 60

  const section = makeSection([makeRow([heading]), makeRow([emptyImage, emptyCalendar])])
  section.background = { type: 'color', value: 'cream', overlay: 0 }
  section.rows[1].align = 'top'
  return section
}

const home = makePage('Home', 'home', [
  mikeSection(), 
  heroSection(),
  twoColumnSection(),
  gallerySection(),
  emptyStateSection(),
])

const second = makePage('Second Page', 'second', [
  (() => {
    const s = makeSection([
      makeRow([
        makeBlock('text', {
          content: 'Second Page',
          tag: 'h1',
          size: 'xl',
          font: 'heading',
          weight: 'bold',
          color: 'forest',
        }),
      ]),
      makeRow([
        makeBlock('text', {
          content:
            'This page exists only to prove the navigation switches between pages. Multipage support is the big gap in the site being replaced.',
        }),
      ]),
    ])
    return s
  })(),
])

export const fixtureSite = {
  title: 'Troop 505 & 1505',
  nav: { bgColor: 'forest', textColor: 'cream' },
  pages: [home, second],
}
