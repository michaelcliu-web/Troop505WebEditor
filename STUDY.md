# What to read, in order

There are ~1,800 lines in this project. **About 300 of them matter for understanding.** The rest
is throwaway test data, styling values, and boilerplate you should skim and forget.

Read in this order. Each file assumes the one before it.

---

## 1. `SCHEMA.md` — the concept, no code

**Find:** why a page is data instead of HTML, and what the four levels are.

**The one idea:** there is no HTML for "the homepage" anywhere in this project. There's a data
structure and a function that draws it.

**Self-test:** name the four levels, top to bottom, without looking.

---

## 2. `src/blocks/TextBlock.jsx` — 25 lines, the smallest complete component

Start here for code because it's the whole React model at minimum size.

**Find:**
- A component is **a function that takes data and returns markup**. That's all one is.
- It receives `props` and reads `content`, `size`, `color`… out of it.
- It knows *nothing* about what page it's on or what's above it. It only sees its own props.
  That isolation is what makes blocks reusable anywhere the editor puts them.
- `const Tag = ...` then `<Tag>` — the HTML element itself is chosen from data.

**Self-test:** where does `props.content` come from? Trace it back one level.

---

## 3. `src/blocks/index.js` — 21 lines, the lookup table

**Find:** `BLOCK_COMPONENTS` — a plain object mapping the string `'text'` to the `TextBlock`
function. Nothing clever, and that's the point.

**Why it matters:** this is how the renderer draws a block type it was never told about. It looks
the type up by name at runtime. Adding a new kind of block is one line here plus one in
`schema.js` — no other file changes, including the editor.

**Self-test:** what would happen if a saved page contained `type: 'banana'`? (Then check
`Renderer.jsx` line 29 to see if you were right.)

---

## 4. `src/Renderer.jsx` — 163 lines, **the heart of the project**

If you only truly understand one file, this is the one.

**Find, in this order:**

| Lines | What to look for |
|---|---|
| 147–163 | `Renderer` — the top. Loops sections. Notice how little it does. |
| 82–145 | `Section` — background photo vs. color, the darkening overlay, then loops rows |
| 59–80 | `Row` — `flex-col sm:flex-row` (phones stack, desktops sit side by side) and `flexBasis` for width % |
| 24–57 | `Block` — the lookup, and the `if (!editing) return content` split |

**The four functions mirror the four levels of the data.** Each one draws its own wrapper, then
loops its children into the next function down.

**Also find:**
- `key={block.id}` on every `.map()` — React's name tag for list items. Stable ids are what will
  make drag-and-drop work.
- `editing`, `selectedId`, `onSelect` being passed down untouched through levels that don't use
  them. **Data flows down as props; events flow up as function calls.**
- `e.stopPropagation()` — clicks travel outward through ancestors unless you stop them.
- Line 37: one renderer draws both the public site and the edit canvas, so they cannot drift apart.

**Self-test:** one section, three rows, middle row has two blocks — how many times does each
function run?

---

## 5. `src/schema.js` — 216 lines, but only read two parts

**Read:** `TOKENS` and `token()` at the bottom.

**Find:**
- The JSON stores **intent** (`size: 'lg'`), not CSS (`font-size: 1.875rem`). `TOKENS` is the
  translation table between them.
- `token()` is the middleman *you wrote* — React had nothing to do with it.
- The fallback + console warning: why `'Orange'` silently did nothing, and why it now complains.

**Skim and move on:** `BLOCK_TYPES` (just default values), `makeBlock`/`makeRow`/`makeSection`
(convenience constructors).

**Self-test:** why are the class names spelled out in full instead of built as `` `text-${size}` ``?

---

## 6. `src/App.jsx` — 132 lines, where the loop closes

**Find:**
- `const [site, setSite] = useState(fixtureSite)` — the single line that separates Day 1 from
  Day 2. Before, the site was a fixed import nothing could change.
- `const [selection, setSelection] = useState(null)` — what's currently clicked.
- The three `change...` functions. **Every edit in the entire app funnels through these.**
- **There is no "redraw the screen" line anywhere.** You hand React a new site object; it works
  out what changed. That's the whole reason React is here.

**Self-test:** click a block, change its color. List every function that runs, in order, from
click to repaint.

---

## 7. `src/state/pageOps.js` — 94 lines, the rule that trips everyone

**Find:** every function builds a **new** object instead of changing the old one — all those
`...` spreads.

**Why:** React decides whether to redraw by asking "is this a different object than before?"
Edit the old one in place and it's still the same object, so **nothing happens on screen.** This
is the single most common React bug.

**Bonus:** this is also why Undo will be nearly free — every edit leaves the previous version
intact.

**Self-test:** what breaks if you write `site.pages[0].title = 'Home'` instead?

---

## 8. `src/edit/Field.jsx` — 127 lines, how form inputs work in React

**Find:** the input doesn't own its value. It's handed `value` and `onChange` and does nothing on
its own — it reports "the user typed this" upward and waits to be re-rendered with a new value.

**The loop:** type → `onChange` → state updates → re-render → input shows the new value. It feels
circular because it is. (The jargon is "controlled component". The name is worse than the idea.)

**Self-test:** if `onChange` did nothing at all, what would happen as you typed?

---

## 9. `src/edit/controls.js` + `PropertiesPanel.jsx` — the same trick, one level up

**Find:** `PropertiesPanel` contains **no knowledge of any block type**. It reads a list of
descriptions in `controls.js` and builds itself.

**Why this is the same idea as the renderer:** describe it as data, let generic code handle it.
That's the pattern the whole project runs on. Adding an option to a block is one line in
`controls.js` — no panel code.

**Skim:** `controls.js` is mostly lists of dropdown options. Read one block's entry, get the
shape, skip the rest.

---

## Skip entirely (for now)

| File | Why |
|---|---|
| `src/data/fixture.js` | Throwaway test data. Gets deleted once the editor builds real pages. |
| `src/blocks/VideoBlock.jsx` | The URL-parsing half is fiddly and teaches nothing general. |
| `src/blocks/GalleryBlock.jsx`, `ImageBlock`, `ButtonBlock`, `CalendarBlock` | Same shape as `TextBlock`, no new ideas. |
| `src/SiteHeader.jsx` | Read it later, when multipage nav matters. |
| `vite.config.js`, `index.css`, `package.json` | Setup. Vibe-code territory. |

---

## The four ideas the whole project rests on

If these four click, you can read every file here:

1. **A component is a function: data in, markup out.**
2. **Data flows down as props; events flow up as function calls.**
3. **Never change data in place — build a new version.** Otherwise React won't notice.
4. **Describe things as data and let generic code handle them** — blocks, style tokens, panel
   controls are all the same trick.

Everything remaining in this project (drag-and-drop, undo, save, publish) is a manipulation of
data, not of the page.
