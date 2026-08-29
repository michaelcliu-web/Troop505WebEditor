import { useCallback, useState } from 'react'

/*
  Version history — deliberately SEPARATE from undo/redo.

  Undo is fine-grained, disposable, and loses its redo branch the moment you make a new
  edit. Version history is coarse, permanent, and never destroyed by editing. Every real
  editor has both; they answer different questions:

      undo             "oops, take that back"
      version history  "what did this look like an hour ago?"

  A version is just a saved `site` object. Because pageOps copies only the path down to
  whatever changed, saved versions share nearly all their contents with each other — so
  keeping thirty of them costs very little.

  NOTE: this lives in memory, so refreshing the browser loses it. Day 4 moves it to the
  database, which is when it becomes genuinely useful.
*/

const LIMIT = 30

export default function useVersions() {
  const [versions, setVersions] = useState([])

  const saveVersion = useCallback((site, label) => {
    const entry = { id: `ver_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, label, time: Date.now(), site }
    setVersions((list) => {
      // Nothing has changed since the newest version — don't save a duplicate.
      if (list[0]?.site === site) return list
      return [entry, ...list].slice(0, LIMIT)
    })
  }, [])

  return { versions, saveVersion }
}
