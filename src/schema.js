/*
  The page schema, as code.

  Read SCHEMA.md first for the plain-English version. This file is the machine-readable
  counterpart: it defines what a fresh block of each type looks like, and it's the single
  place to change if a block gains a new option.
*/

/** Unique, stable id. Drag-and-drop and undo both find things by id, so never reuse one. */
export function newId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

/*
  Blocks are described by a registry rather than a switch statement scattered around the
  codebase. The editor will later read this same registry to build its "Add..." menu and its
  properties panel, so a new block type only has to be described once.

  `label` is what a non-technical user sees — "Add a Photo", never "Insert Media Block".
*/
export const BLOCK_TYPES = {
  text: {
    label: 'Words',
    addLabel: 'Add Words',
    defaults: {
      content: 'Write something here.',
      tag: 'p', // h1 | h2 | h3 | p
      align: 'left', // left | center | right
      font: 'body', // body | heading
      size: 'md', // sm | md | lg | xl | 2xl
      color: 'bark',
      weight: 'normal', // normal | medium | bold
    },
  },
  image: {
    label: 'Photo',
    addLabel: 'Add a Photo',
    defaults: {
      src: '',
      alt: '',
      fit: 'cover', // cover | contain
      aspect: '4/3', // 4/3 | 16/9 | 1/1 | auto
      radius: 'md', // none | sm | md | lg | full
      caption: '',
    },
  },
  button: {
    label: 'Button',
    addLabel: 'Add a Button',
    defaults: {
      label: 'Join Us Now',
      href: '#',
      variant: 'primary', // primary | secondary | ghost
      size: 'md', // sm | md | lg
      align: 'left', // left | center | right
    },
  },
  gallery: {
    label: 'Photo Gallery',
    addLabel: 'Add a Photo Gallery',
    defaults: {
      images: [], // [{ id, src, alt }]
      columns: 3, // 2 | 3 | 4
      gap: 'md', // sm | md | lg
      radius: 'md',
    },
  },
  video: {
    label: 'Video',
    addLabel: 'Add a Video',
    defaults: {
      // Videos are never self-hosted — always a YouTube/Vimeo link (cost + performance).
      url: '',
      caption: '',
      radius: 'md',
    },
  },
  calendar: {
    label: 'Schedule',
    addLabel: 'Add the Schedule',
    defaults: {
      // A Google Calendar embed URL for the troop's PUBLIC calendar.
      // Using a separate public calendar keeps scout-only events private by construction.
      embedUrl: '',
      height: 500,
    },
  },
}

/** A fresh block of the given type, ready to drop into a row. */
export function makeBlock(type, overrides = {}) {
  const spec = BLOCK_TYPES[type]
  if (!spec) throw new Error(`Unknown block type: ${type}`)
  return {
    id: newId('blk'),
    type,
    width: 100, // percentage of the row
    props: { ...spec.defaults, ...overrides },
  }
}

export function makeRow(blocks = []) {
  return { id: newId('row'), gap: 'md', align: 'center', blocks }
}

export function makeSection(rows = []) {
  return {
    id: newId('sec'),
    background: { type: 'color', value: 'cream', overlay: 0 },
    padding: 'lg',
    maxWidth: 'normal',
    rows,
  }
}

export function makePage(title, slug, sections = []) {
  return { id: newId('page'), title, slug, sections }
}

/*
  Style token maps.

  These exist so the JSON stays human-readable ("size": "lg") instead of storing raw CSS
  ("fontSize": "1.875rem"). The JSON describes INTENT; this file decides what that intent
  looks like. Re-theming the whole site means editing here, not editing every page.

  Tailwind needs to see complete class names as literal strings to include them in the build,
  which is why these are spelled out rather than assembled like `text-${size}`.
*/
export const TOKENS = {
  textSize: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
    '2xl': 'text-5xl',
  },
  textAlign: { left: 'text-left', center: 'text-center', right: 'text-right' },
  fontWeight: { normal: 'font-normal', medium: 'font-medium', bold: 'font-bold' },
  fontFamily: { body: 'font-[family-name:var(--font-body)]', heading: 'font-[family-name:var(--font-heading)]' },
  textColor: {
    bark: 'text-[var(--color-bark)]',
    cream: 'text-[var(--color-cream)]',
    forest: 'text-[var(--color-forest)]',
    ember: 'text-[var(--color-ember)]',
    dusk: 'text-[var(--color-dusk)]',
  },
  bgColor: {
    cream: 'bg-[var(--color-cream)]',
    parchment: 'bg-[var(--color-parchment)]',
    forest: 'bg-[var(--color-forest)]',
    'forest-deep': 'bg-[var(--color-forest-deep)]',
    ember: 'bg-[var(--color-ember)]',
    bark: 'bg-[var(--color-bark)]',
  },
  padding: { sm: 'py-6', md: 'py-12', lg: 'py-20', xl: 'py-32' },
  maxWidth: {
    narrow: 'max-w-2xl',
    normal: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  },
  gap: { sm: 'gap-2', md: 'gap-6', lg: 'gap-12' },
  rowAlign: { top: 'items-start', center: 'items-center', bottom: 'items-end' },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-xl',
    lg: 'rounded-3xl',
    full: 'rounded-full',
  },
  aspect: { '4/3': 'aspect-[4/3]', '16/9': 'aspect-video', '1/1': 'aspect-square', auto: '' },
  columns: { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' },
}

/*
  What each group falls back to when it's handed something it doesn't recognise.

  This matters more than it looks. Without it, a typo like size: '3xl' produces NO size class
  at all, and the text silently renders at whatever size it inherits — which looks broken but
  gives no clue why. Falling back to the normal value instead means a bad value looks ordinary,
  never broken.
*/
const TOKEN_FALLBACKS = {
  textSize: 'md',
  textAlign: 'left',
  fontWeight: 'normal',
  fontFamily: 'body',
  textColor: 'bark',
  bgColor: 'cream',
  padding: 'lg',
  maxWidth: 'normal',
  gap: 'md',
  rowAlign: 'center',
  radius: 'md',
  aspect: '4/3',
  columns: 3,
}

/** Look up a token, falling back to the group's default rather than rendering something broken. */
export function token(group, key, fallback = '') {
  const groupTokens = TOKENS[group]
  if (!groupTokens) return fallback

  if (key !== undefined && groupTokens[key] === undefined && import.meta.env.DEV) {
    // Falling back silently is right for a leader using the editor — a typo should never
    // look broken. But while developing it hides mistakes, so say so in the console.
    // `import.meta.env.DEV` means this warning disappears from the real published site.
    console.warn(
      `Unknown ${group}: "${key}". Using "${TOKEN_FALLBACKS[group]}" instead. ` +
        `Valid values: ${Object.keys(groupTokens).join(', ')}`,
    )
  }

  return groupTokens[key] ?? groupTokens[TOKEN_FALLBACKS[group]] ?? fallback
}
