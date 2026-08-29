/*
  Why keeping 50 past versions does not cost 50 websites.
  Run:  node learn/why-history-is-cheap.js
*/

const site = {
  pages: [
    {
      slug: 'home',
      sections: [
        { id: 'sec_A', background: 'ember', rows: [{ id: 'row_1', blocks: [{ id: 'blk_1', text: 'Yale' }] }] },
        { id: 'sec_B', background: 'cream', rows: [{ id: 'row_2', blocks: [{ id: 'blk_2', text: 'Michael' }] }] },
        { id: 'sec_C', background: 'forest', rows: [{ id: 'row_3', blocks: [{ id: 'blk_3', text: 'Gallery' }] }] },
      ],
    },
  ],
}

// change ONE thing in sec_B, exactly the way pageOps does it
const next = {
  ...site,
  pages: site.pages.map((page) => ({
    ...page,
    sections: page.sections.map((section) =>
      section.id === 'sec_B' ? { ...section, background: 'bark' } : section,
    ),
  })),
}

const same = (a, b) => (a === b ? 'SAME object in memory' : 'new copy')

console.log('the site itself        ', same(site, next))
console.log('the pages array        ', same(site.pages, next.pages))
console.log('the home page          ', same(site.pages[0], next.pages[0]))
console.log('the sections array     ', same(site.pages[0].sections, next.pages[0].sections))
console.log('')
console.log('sec_A                  ', same(site.pages[0].sections[0], next.pages[0].sections[0]))
console.log('sec_B  (the one changed)', same(site.pages[0].sections[1], next.pages[0].sections[1]))
console.log('sec_C                  ', same(site.pages[0].sections[2], next.pages[0].sections[2]))
console.log('')
console.log("sec_B's rows           ", same(site.pages[0].sections[1].rows, next.pages[0].sections[1].rows))
console.log("sec_B's block          ", same(site.pages[0].sections[1].rows[0].blocks[0], next.pages[0].sections[1].rows[0].blocks[0]))
console.log('')
console.log('old background:', site.pages[0].sections[1].background)
console.log('new background:', next.pages[0].sections[1].background)
