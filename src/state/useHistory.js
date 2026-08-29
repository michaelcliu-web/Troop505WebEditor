import { useCallback, useRef, useState } from 'react'

/*
  Undo and redo.

  The whole idea in one picture:

      past: [older, older, older]     present: the site you see     future: [undone, undone]

  Undo  = move the newest item from `past` into `present`, and push the old present into `future`.
  Redo  = the mirror image.
  A new edit = push the present into `past`, and throw `future` away — you changed the timeline,
  so the branch you had undone no longer applies. (Every editor works this way.)

  This costs almost nothing in memory. pageOps only copies the path down to the thing that
  changed, so 50 saved versions share nearly all of the same objects underneath. It is 50
  pointers, not 50 whole websites.

  MERGING: every keystroke is a change, so without help, undo would step back one letter at a
  time. When a change passes a `mergeKey`, and the previous change had the same key and happened
  within a moment, we overwrite the top of the history instead of adding to it. That turns a
  burst of typing into a single undo step.
*/

const LIMIT = 50
const MERGE_WINDOW_MS = 700

export default function useHistory(initial) {
  const [timeline, setTimeline] = useState({ past: [], present: initial, future: [] })
  const lastChange = useRef({ key: null, time: 0 })

  /*
    Replaces setSite. Takes the same kind of function you already know:
    (currentSite) => newSite
  */
  const commit = useCallback((makeNext, mergeKey = null) => {
    /*
      Decide about merging HERE, before touching state.

      The function handed to setTimeline must be pure — same input, same output, no
      side effects. React deliberately runs it twice in development to catch impure
      ones. When this bookkeeping lived inside it, the second run saw the marks left
      by the first, wrongly concluded "merge", and threw the history entry away.
    */
    const now = Date.now()
    const merge =
      mergeKey !== null &&
      mergeKey === lastChange.current.key &&
      now - lastChange.current.time < MERGE_WINDOW_MS

    lastChange.current = { key: mergeKey, time: now }

    setTimeline((t) => {
      const next = makeNext(t.present)
      if (next === t.present) return t // nothing actually changed

      return {
        past: merge ? t.past : [...t.past, t.present].slice(-LIMIT),
        present: next,
        future: [],
      }
    })
  }, [])

  const undo = useCallback(() => {
    lastChange.current = { key: null, time: 0 } // don't merge across an undo
    setTimeline((t) => {
      if (t.past.length === 0) return t
      return {
        past: t.past.slice(0, -1),
        present: t.past[t.past.length - 1],
        future: [t.present, ...t.future].slice(0, LIMIT),
      }
    })
  }, [])

  const redo = useCallback(() => {
    lastChange.current = { key: null, time: 0 }
    setTimeline((t) => {
      if (t.future.length === 0) return t
      return {
        past: [...t.past, t.present].slice(-LIMIT),
        present: t.future[0],
        future: t.future.slice(1),
      }
    })
  }, [])

  return {
    site: timeline.present,
    commit,
    undo,
    redo,
    canUndo: timeline.past.length > 0,
    canRedo: timeline.future.length > 0,
  }
}
