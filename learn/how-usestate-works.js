/*
  A 40-line useState, in plain JavaScript. No React.
  Run it:  node learn/how-usestate-works.js

  The point: useState cannot tell who called it. React writes down who it is
  about to run, immediately before running it, and useState reads that note.
*/

let currentComponent = null   // the sticky note
let hookIndex = 0             // which useState call we are on

function useState(initialValue) {
  const memory = currentComponent.hooks
  const i = hookIndex
  hookIndex++

  if (memory[i] === undefined) memory[i] = initialValue

  const owner = currentComponent
  function setState(newValue) {
    memory[i] = newValue
    render(owner)             // React would schedule this, not do it immediately
  }

  return [memory[i], setState]
}

function render(instance) {
  currentComponent = instance
  hookIndex = 0
  const output = instance.fn()
  currentComponent = null
  return output
}

// ── two instances of the SAME function, each with its own memory ──

function Counter() {
  const [count, setCount] = useState(0)
  console.log(`  ${currentComponent.name}: count is ${count}`)
  return { increment: () => setCount(count + 1) }
}

const a = { name: 'CounterA', fn: Counter, hooks: [] }
const b = { name: 'CounterB', fn: Counter, hooks: [] }

console.log('first render of both:')
const aHandle = render(a)
render(b)

console.log('\nincrement A twice:')
aHandle.increment()
render(a).increment()

console.log('\nrender B again — untouched, its memory is separate:')
render(b)

console.log('\nthe raw memory lists:')
console.log('  A.hooks =', a.hooks)
console.log('  B.hooks =', b.hooks)
