/*
  What the properties panel shows for each kind of block.

  This is a DESCRIPTION, not code — a list of "here's a control, here's its label, here are the
  choices". The panel reads this list and builds itself. Adding an option to a block means adding
  a line here, not writing new panel code.

  Labels are written for a scoutmaster, not a developer: "How big" instead of "fontSize",
  "Darken the photo" instead of "overlay".
*/

const pick = (...values) => values.map((v) => ({ value: v, label: v }))

const COLOR_CHOICES = [
  { value: 'bark', label: 'Dark brown' },
  { value: 'cream', label: 'Cream (for dark backgrounds)' },
  { value: 'forest', label: 'Green' },
  { value: 'ember', label: 'Orange' },
  { value: 'dusk', label: 'Grey' },
]

const BACKGROUND_CHOICES = [
  { value: 'cream', label: 'Cream' },
  { value: 'parchment', label: 'Warm beige' },
  { value: 'forest', label: 'Green' },
  { value: 'forest-deep', label: 'Dark green' },
  { value: 'ember', label: 'Orange' },
  { value: 'bark', label: 'Dark brown' },
]

const SIZE_CHOICES = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Normal' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
  { value: '2xl', label: 'Huge' },
]

const ALIGN_CHOICES = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

export const BLOCK_CONTROLS = {
  text: [
    { key: 'content', label: 'Text', type: 'textarea' },
    {
      key: 'tag',
      label: 'What kind of text is this?',
      type: 'select',
      hint: 'Headings help Google and screen readers understand the page.',
      options: [
        { value: 'h1', label: 'Main title' },
        { value: 'h2', label: 'Section heading' },
        { value: 'h3', label: 'Small heading' },
        { value: 'p', label: 'Paragraph' },
      ],
    },
    { key: 'size', label: 'How big', type: 'select', options: SIZE_CHOICES },
    { key: 'align', label: 'Position', type: 'select', options: ALIGN_CHOICES },
    {
      key: 'font',
      label: 'Font',
      type: 'select',
      options: [
        { value: 'body', label: 'Regular' },
        { value: 'heading', label: 'Display' },
      ],
    },
    {
      key: 'weight',
      label: 'Thickness',
      type: 'select',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'medium', label: 'Medium' },
        { value: 'bold', label: 'Bold' },
      ],
    },
    { key: 'color', label: 'Color', type: 'select', options: COLOR_CHOICES },
  ],

  image: [
    { key: 'src', label: 'Photo link', type: 'text', placeholder: 'https://...' },
    {
      key: 'alt',
      label: 'Describe the photo',
      type: 'text',
      hint: 'Read aloud to people who use screen readers.',
    },
    {
      key: 'aspect',
      label: 'Shape',
      type: 'select',
      options: [
        { value: '4/3', label: 'Standard' },
        { value: '16/9', label: 'Wide' },
        { value: '1/1', label: 'Square' },
        { value: 'auto', label: "Whatever the photo's shape is" },
      ],
    },
    {
      key: 'fit',
      label: 'Fill the space?',
      type: 'select',
      options: [
        { value: 'cover', label: 'Fill it (may crop the edges)' },
        { value: 'contain', label: 'Show the whole photo' },
      ],
    },
    {
      key: 'radius',
      label: 'Rounded corners',
      type: 'select',
      options: [
        { value: 'none', label: 'Square' },
        { value: 'sm', label: 'Slightly rounded' },
        { value: 'md', label: 'Rounded' },
        { value: 'lg', label: 'Very rounded' },
        { value: 'full', label: 'Circle' },
      ],
    },
    { key: 'caption', label: 'Caption (optional)', type: 'text' },
  ],

  button: [
    { key: 'label', label: 'Button words', type: 'text' },
    { key: 'href', label: 'Where it goes', type: 'text', placeholder: 'https://...' },
    {
      key: 'variant',
      label: 'Style',
      type: 'select',
      options: [
        { value: 'primary', label: 'Orange (most important)' },
        { value: 'secondary', label: 'Green' },
        { value: 'ghost', label: 'Outline only' },
      ],
    },
    {
      key: 'size',
      label: 'How big',
      type: 'select',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Normal' },
        { value: 'lg', label: 'Large' },
      ],
    },
    { key: 'align', label: 'Position', type: 'select', options: ALIGN_CHOICES },
  ],

  gallery: [
    {
      key: 'images',
      label: 'Photo links',
      type: 'urlList',
      hint: 'One link per line. Day 4 replaces this with real photo uploads.',
    },
    {
      key: 'columns',
      label: 'Photos per row',
      type: 'select',
      options: [
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
      ],
    },
    {
      key: 'gap',
      label: 'Space between',
      type: 'select',
      options: [
        { value: 'sm', label: 'Tight' },
        { value: 'md', label: 'Normal' },
        { value: 'lg', label: 'Roomy' },
      ],
    },
  ],

  video: [
    {
      key: 'url',
      label: 'YouTube or Vimeo link',
      type: 'text',
      placeholder: 'https://www.youtube.com/watch?v=...',
      hint: 'Just paste the normal link from the address bar.',
    },
    { key: 'caption', label: 'Caption (optional)', type: 'text' },
  ],

  calendar: [
    {
      key: 'embedUrl',
      label: 'Google Calendar link',
      type: 'text',
      hint: 'Use a separate PUBLIC calendar so scout-only events never appear here.',
    },
    { key: 'height', label: 'How tall (pixels)', type: 'number' },
  ],
}

/** Controls for a whole section — the background lives here, not on individual blocks. */
export const SECTION_CONTROLS = [
  {
    key: 'background.type',
    label: 'Background',
    type: 'select',
    options: [
      { value: 'color', label: 'Plain color' },
      { value: 'image', label: 'Photo' },
    ],
  },
  {
    key: 'background.value',
    label: 'Which color',
    type: 'select',
    options: BACKGROUND_CHOICES,
    showIf: (section) => section.background?.type === 'color',
  },
  {
    key: 'background.value',
    label: 'Photo link',
    type: 'text',
    placeholder: 'https://...',
    showIf: (section) => section.background?.type === 'image',
  },
  {
    key: 'background.overlay',
    label: 'Darken the photo',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.05,
    hint: 'Turn this up until the text is easy to read.',
    showIf: (section) => section.background?.type === 'image',
  },
  {
    key: 'padding',
    label: 'Breathing room',
    type: 'select',
    options: [
      { value: 'sm', label: 'Tight' },
      { value: 'md', label: 'Normal' },
      { value: 'lg', label: 'Roomy' },
      { value: 'xl', label: 'Very roomy' },
    ],
  },
  {
    key: 'maxWidth',
    label: 'Content width',
    type: 'select',
    options: [
      { value: 'narrow', label: 'Narrow' },
      { value: 'normal', label: 'Normal' },
      { value: 'wide', label: 'Wide' },
      { value: 'full', label: 'Edge to edge' },
    ],
  },
]

export { pick }
