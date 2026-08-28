/*
  Operations on site data.

  The single rule in this file: NEVER change the existing object — always build a new one.

  Why: React decides whether to redraw by asking "is this a different object than before?"
  If you edit the old object in place, it's still the same object, and the screen won't update.
  So every function here copies its way down to the thing being changed and returns a fresh site.

  This also happens to be what makes Undo nearly free later — every edit leaves the previous
  version intact, so keeping a list of old versions costs almost nothing.
*/

import { makeRow } from '../schema'

/** Apply `fn` to the block with this id, anywhere in the site. Returns a new site. */
function mapBlock(site, blockId, fn) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          blocks: row.blocks.map((block) => (block.id === blockId ? fn(block) : block)),
        })),
      })),
    })),
  }
}

/** Change something on the block itself — currently just `width`. */
export function updateBlock(site, blockId, patch) {
  return mapBlock(site, blockId, (block) => ({ ...block, ...patch }))
}

/** Change the block's content/appearance, e.g. { size: 'lg' }. */
export function updateBlockProps(site, blockId, patch) {
  return mapBlock(site, blockId, (block) => ({
    ...block,
    props: { ...block.props, ...patch },
  }))
}

/** Change something on a section, e.g. { padding: 'xl' }. */
export function updateSection(site, sectionId, patch) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    })),
  }
}

/** Change part of a section's background, e.g. { overlay: 0.6 }. */
export function updateSectionBackground(site, sectionId, patch) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) =>
        section.id === sectionId
          ? { ...section, background: { ...section.background, ...patch } }
          : section,
      ),
    })),
  }
}

/** Look up a block by id (read-only). */
export function findBlock(site, blockId) {
  for (const page of site.pages) {
    for (const section of page.sections) {
      for (const row of section.rows) {
        for (const block of row.blocks) {
          if (block.id === blockId) return block
        }
      }
    }
  }
  return null
}

/** Look up a section by id (read-only). */
export function findSection(site, sectionId) {
  for (const page of site.pages) {
    for (const section of page.sections) {
      if (section.id === sectionId) return section
    }
  }
  return null
}

/*
  ── Adding and removing ──

  Same rule as everything above: never change what's there, build a new copy.
  Adding is just a copy of the list with one more item; removing is a copy with
  one fewer. The `make*` functions in schema.js build the new item itself.
*/

/** Add a block to the end of a section, in a row of its own. */
export function addBlockToSection(site, sectionId, block) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) =>
        section.id === sectionId
          ? { ...section, rows: [...section.rows, makeRow([block])] }
          : section,
      ),
    })),
  }
}

/** Remove a block. If that empties its row, the row goes too. */
export function deleteBlock(site, blockId) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        rows: section.rows
          .map((row) => ({ ...row, blocks: row.blocks.filter((b) => b.id !== blockId) }))
          .filter((row) => row.blocks.length > 0),
      })),
    })),
  }
}

/** Add a section to the end of a page. */
export function addSectionToPage(site, pageSlug, section) {
  return {
    ...site,
    pages: site.pages.map((page) =>
      page.slug === pageSlug ? { ...page, sections: [...page.sections, section] } : page,
    ),
  }
}

/** Remove a whole section and everything in it. */
export function deleteSection(site, sectionId) {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.filter((section) => section.id !== sectionId),
    })),
  }
}
