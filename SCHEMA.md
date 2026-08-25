# The page schema — in plain English

## The one big idea

**A page is data, not HTML.**

Everywhere else on the web, a page is a file full of markup that a human wrote. Here, a page is a
plain JavaScript object — a nested list of things. A component called the **Renderer** reads that
object and draws it on screen.

That single choice is what makes the whole editor possible:

| Feature | Why it becomes easy |
|---|---|
| Editing | change a value in the object, React redraws |
| Undo | keep a copy of the object from a moment ago |
| Save | it's already data — write it to the database as-is |
| Publish | copy the `draft` object over the `published` object |
| Templates | a template is just a pre-filled object |

If a page were HTML, every one of those would be a hard problem.

## The four levels

```
Page
└── Section     a horizontal band of the page; owns the background
    └── Row     a horizontal strip inside a section; holds blocks side by side
        └── Block   the actual content: text, image, button, gallery, video, calendar
```

Think of it like a newspaper. The **section** is a region of the page (with its own background
color or photo). A **row** is a line across that region. **Blocks** are the things sitting in
that line, next to each other.

### Why this structure instead of free dragging?

We deliberately did *not* build "drag anything anywhere, like Canva." That requires solving
collision detection, layering, and what happens on a phone screen — weeks of work.

Instead, blocks snap into rows. You still control a lot: which row something is in, its order in
that row, how wide it is, how it's aligned. You just can't overlap things arbitrarily. That gets
about 90% of the flexible feeling for a small fraction of the effort — **and it stays readable on
a phone automatically**, because rows just stack vertically when the screen is narrow.

## The shapes

Every item has an `id`. That matters more than it looks: drag-and-drop and undo both work by
finding things by id. Never reuse or regenerate one.

```js
Page = {
  id, title,
  slug,                 // "home" -> the URL /home
  sections: [Section]
}

Section = {
  id,
  background: {
    type: "color" | "image",
    value,              // a color token name, or an image URL
    overlay,            // 0–1: darkens a background image so text stays readable
  },
  padding: "sm" | "md" | "lg" | "xl",
  maxWidth: "narrow" | "normal" | "wide" | "full",
  rows: [Row]
}

Row = {
  id,
  gap: "sm" | "md" | "lg",
  align: "top" | "center" | "bottom",   // vertical alignment of blocks in the row
  blocks: [Block]
}

Block = {
  id,
  type,                 // "text" | "image" | "button" | "gallery" | "video" | "calendar"
  width,                // percentage of the row, e.g. 50 for half
  props: { ... }        // different for each type — see src/schema.js
}
```

## Where to look in the code

| File | What it does |
|---|---|
| `src/schema.js` | The shapes above, as code: defaults for every block type, plus `newId()` |
| `src/blocks/` | One small component per block type. Each one just turns `props` into markup. |
| `src/Renderer.jsx` | Walks Page → Section → Row → Block and picks the right component |
| `src/data/fixture.js` | **Throwaway** test data, so the renderer has something to draw |

## About the fixture

`src/data/fixture.js` is scaffolding, not content. It exists only so we can see the renderer work
before the editor exists — you can't build a GUI that outputs a format you've never seen drawn.

**The real site gets built in the editor, not by hand.** The fixture gets deleted.

## The rule that keeps this from falling apart

**Never write a component for one specific page.**

If the homepage needs a two-column photo strip, add a *generic* two-column capability that any
page can use. Never write `<HomepageHero>`. The moment page-specific markup exists, the editor
can no longer reproduce that page — and the whole point was that leaders can edit everything
themselves.
