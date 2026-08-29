import { useEffect, useRef } from 'react'

/*
  Type-on-the-page editing, the Google Docs way.

  `contentEditable` is a plain HTML attribute. Put it on any element and the browser
  turns it into a text box — cursor, clicking to position it, arrow keys, selection,
  copy and paste. None of that is ours to write.

  THE CATCH, and it is the whole reason this file exists:

  Normally React controls what is on screen. Type one letter, we call onChange,
  App updates the site, React re-renders and replaces the text in this element.
  Replacing the text destroys the cursor, so it jumps back to the start on EVERY
  keystroke. Typing "hello" gives you "olleh".

  The fix: let the BROWSER own the text while you type, and only write into the
  element when the value changed somewhere else (like the side panel). While
  typing, `value` already matches what is in the box, so we leave it alone and
  the cursor stays where it is.
*/

export default function EditableText({ tag: Tag, className, value, onChange }) {
  const ref = useRef(null) // a handle on the real element on screen

  // Only push text IN when it differs — i.e. it was changed from somewhere else.
  useEffect(() => {
    const el = ref.current
    if (el && el.innerText !== value) el.innerText = value
  }, [value])

  // Put the cursor at the end as soon as the block is selected.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      // Fires on every keystroke. innerText keeps line breaks; textContent would not.
      onInput={(e) => onChange(e.currentTarget.innerText)}
      className={`${className} outline-none`}
    />
  )
}
