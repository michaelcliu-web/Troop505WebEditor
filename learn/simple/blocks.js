// ── the bottom of the tree: turns props into plain HTML ──

export function TextBlock(props) {
  return `<h1 class="size-${props.size} color-${props.color}">${props.content}</h1>`
}

export function ImageBlock(props) {
  return `<img src="${props.src}">`
}

// the lookup table: a type name -> the function that draws it
export const BLOCK_COMPONENTS = {
  text: TextBlock,
  image: ImageBlock,
}
