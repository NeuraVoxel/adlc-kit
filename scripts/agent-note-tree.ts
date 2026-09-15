/**
 * The Agent Notes classification authority: the closed lifecycle and class
 * sets, strict note-path parsing, and the structural violations a notes tree
 * may have. The format gate owns file content; this gate owns where files
 * live.
 */
import { existsSync, readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const LIFECYCLES = ['proposed', 'implemented', 'rejected', 'archived'] as const
export type Lifecycle = (typeof LIFECYCLES)[number]

export const CLASSES = [
  'feature',
  'bug-fix',
  'simplification',
  'architecture',
  'process',
  'testing',
] as const
export type NoteClass = (typeof CLASSES)[number]

const NOTE_NAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)(?:\.zh)?\.md$/

/** A parsed note path: `{lifecycle}/{class}/yyyy-mm-dd-topic.md`. */
export interface NotePath {
  lifecycle: Lifecycle
  noteClass: NoteClass
  /** First-proposed date, `yyyy-mm-dd`. */
  date: string
  topic: string
}

/**
 * Parse one repo-relative note path under the notes root.
 * @param relPosixPath - path relative to `.agents/notes/`.
 * @returns the parsed axes, or null when any axis is outside the closed sets.
 */
export function parseNotePath(relPosixPath: string): NotePath | null {
  const segments = relPosixPath.split('/')
  if (segments.length !== 3) return null
  const [lifecycle, noteClass, file] = segments
  if (!LIFECYCLES.includes(lifecycle as Lifecycle)) return null
  if (!CLASSES.includes(noteClass as NoteClass)) return null
  const match = NOTE_NAME.exec(file ?? '')
  if (match === null) return null
  return {
    lifecycle: lifecycle as Lifecycle,
    noteClass: noteClass as NoteClass,
    date: match[1]!,
    topic: match[2]!,
  }
}

/**
 * Collect structural violations across a notes corpus.
 * @param relPaths - paths relative to the notes root.
 * @returns one human-readable violation per unclassifiable path; the root
 * README pair is the only exempt surface.
 */
export function findTreeViolations(relPaths: readonly string[]): string[] {
  const violations: string[] = []
  for (const rel of relPaths) {
    if (rel === 'README.md' || rel === 'README.zh.md') continue
    if (parseNotePath(rel) === null) {
      violations.push(
        `unclassifiable note path: ${rel} (expected {lifecycle}/{class}/yyyy-mm-dd-topic.md` +
          ` with lifecycle in ${LIFECYCLES.join('|')} and class in ${CLASSES.join('|')})`,
      )
    }
  }
  return violations.sort()
}

/**
 * Collect every markdown path under the notes tree, README pair included.
 * @param notesDir - absolute path of `.agents/notes/`.
 * @returns sorted paths relative to the notes root.
 */
export function collectNotePaths(notesDir: string): string[] {
  const paths: string[] = []
  const walk = (dir: string): void => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        paths.push(relative(notesDir, abs).split('\\').join('/'))
      }
    }
  }
  walk(notesDir)
  return paths.sort()
}

// Entry guards compare URLs: import.meta.main is unreliable under
// loader-based TS execution outside the invoking project.
const isEntry =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isEntry) {
  const notesDir = resolve(import.meta.dirname, '..', '.agents', 'notes')
  const paths = collectNotePaths(notesDir)
  const violations = findTreeViolations(paths)
  if (violations.length > 0) {
    console.error(
      `agent-note-tree: ${violations.length} violation(s):\n${violations.map(line => `  - ${line}`).join('\n')}`,
    )
    process.exitCode = 1
  } else {
    console.log(`agent-note-tree: ${paths.length} path(s) classified.`)
  }
}
