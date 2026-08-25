# Playground — poke at the data and watch the page change

The dev server is at **http://localhost:5174/**. Edit a file, hit save, and the browser updates
in about a second. No refresh needed.

Everything below happens in **`src/data/fixture.js`**. That's the throwaway test data — you
cannot break the real site by messing with it, because there is no real site yet.

If something goes wrong, an error overlay appears on the page. Undo your edit (Cmd-Z), save
again, and it comes right back. To wipe out all your experiments at once:

```bash
cd ~/Downloads/troop505-site && git checkout src/data/fixture.js
```

---

## Start here — five edits, in order

**1. Change some words.** Find `'A Placeholder Headline'` and type something else. Save.
*This is the whole idea in one edit: you changed data, not markup, and the page redrew.*

**2. Change the background photo.** In `heroSection()`, find:
```js
section.background = { type: 'image', value: photo('camp'), overlay: 0.5 }
```
Change `photo('camp')` to `photo('anything-you-want')` — any word gives a different random photo.
Then change `overlay: 0.5` to `0` and save. Notice the text becomes hard to read. Try `0.8`.
*That's why the overlay exists.*

**3. Swap it to a flat color instead:**
```js
section.background = { type: 'color', value: 'forest', overlay: 0 }
```
Colors: `cream`, `parchment`, `forest`, `forest-deep`, `ember`, `bark`.

**4. Change the column split.** In `twoColumnSection()`, find `text.width = 50` and
`image.width = 50`. Try `70` / `30`. Save.
*Widths are percentages of the row.*

**5. Make the browser window narrow.** Drag it thin, or open dev tools. The two columns stack
into one. **You didn't write any code for that** — it's free because blocks live in rows instead
of being positioned by pixel. This is the payoff for the section/row/block decision.

---

## Every legal value

Anything not on these lists gets ignored and falls back to a default — so a typo makes something
look plain, not broken.

### Text
| Option | Values |
|---|---|
| `tag` | `h1` `h2` `h3` `p` — the real HTML element (matters for screen readers + Google) |
| `size` | `sm` `md` `lg` `xl` `2xl` — how big it *looks*, separate from `tag` |
| `align` | `left` `center` `right` |
| `font` | `body` `heading` |
| `weight` | `normal` `medium` `bold` |
| `color` | `bark` `cream` `forest` `ember` `dusk` |

### Photo
| Option | Values |
|---|---|
| `src` | any image URL |
| `aspect` | `4/3` `16/9` `1/1` `auto` |
| `fit` | `cover` (fills, may crop) `contain` (whole photo, may letterbox) |
| `radius` | `none` `sm` `md` `lg` `full` |
| `caption` | any text |

### Button
| Option | Values |
|---|---|
| `variant` | `primary` (ember) `secondary` (forest) `ghost` (outline) |
| `size` | `sm` `md` `lg` |
| `align` | `left` `center` `right` |

### Gallery
`columns`: `2` `3` `4` · `gap`: `sm` `md` `lg` · `radius`: as above

### Video
`url`: any normal YouTube or Vimeo link — paste the one from the address bar, it gets converted
automatically. Try a real troop video.

### Section
| Option | Values |
|---|---|
| `background.type` | `color` or `image` |
| `background.value` | a color name, or an image URL |
| `background.overlay` | `0` to `1` — darkens a background photo so text stays readable |
| `padding` | `sm` `md` `lg` `xl` — vertical breathing room |
| `maxWidth` | `narrow` `normal` `wide` `full` — how far content spreads |

### Row
`gap`: `sm` `md` `lg` · `align`: `top` `center` `bottom`

---

## Harder experiments

**Add a whole new section.** Copy one of the `function ...Section()` blocks, rename it, and add
it to the `makePage('Home', 'home', [...])` list at the bottom.

**Add a third page.** Copy the `second` page, change the title and slug, and add it to
`fixtureSite.pages`. A nav tab appears by itself — the header is generated from the page list.

**Break something on purpose.** Set a block's `type` to `'banana'`. Instead of a crash you get a
polite "Can't show this yet" box. That's deliberate: a leader should never see a white screen.

---

## The point of all this

Every single thing you just changed by editing a file is something the editor will change with a
click on Day 2. The properties panel is a set of dropdowns wired to these exact values.

You are, right now, using the editor — just with a text file as the interface instead of buttons.
