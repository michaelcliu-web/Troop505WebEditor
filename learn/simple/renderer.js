import { BLOCK_COMPONENTS } from './blocks.js'

// Each function draws its own wrapper, then loops its children
// into the function below it. Four levels, same as the real app.

function Block(block) {
  const Component = BLOCK_COMPONENTS[block.type]
  return Component(block.props)
}

function Row(row) {
  const inside = row.blocks.map(Block).join('')
  return `<div class="row">${inside}</div>`
}

function Section(section) {
  const inside = section.rows.map(Row).join('')
  return `<section class="bg-${section.background}">${inside}</section>`
}

export function Renderer(page) {
  const inside = page.sections.map(Section).join('')
  return `<main>${inside}</main>`
}
