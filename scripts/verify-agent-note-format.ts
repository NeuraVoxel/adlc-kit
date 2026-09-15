/**
 * Content rules for one Agent Note: the header block, the per-lifecycle
 * skeleton, and the alternatives mandate. The classification gate owns where
 * the file lives; this gate owns what is inside it. Chinese counterparts are
 * skipped here — the doc pairing gate checks their structure.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { collectNotePaths, parseNotePath, type Lifecycle } from './agent-note-tree.ts'

/** The exact escape comment for notes predating the format gate. */
export const ALTERNATIVES_ESCAPE =
  '<!-- agent-note-format: alternatives-not-recorded (pre-format Agent Note) -->'

/** Headings that describe plans, forbidden once a decision has shipped. */
export const FORBIDDEN_AFTER_SHIPPING = [
  '## Proposal',
  '## Plan',
  '## Migration plan',
  '## Acceptance criteria',
]

const REQUIRED_SECTIONS: Readonly<Record<Lifecycle, readonly string[]>> = {
  proposed: ['## Problem', '## Proposal', '## Alternatives considered', '## Acceptance criteria', '## Risks'],
  implemented: ['## Problem', '## Decision', '## Alternatives considered', '## Consequences'],
  rejected: ['## Problem', '## Proposal', '## Alternatives considered'],
  archived: ['## Problem', '## Decision', '## Alternatives considered', '## Consequences'],
}

const ARCHIVED_LINE = /^Archived: \d{4}-\d{2}-\d{2}$/

/**
 * Collect content violations for one note.
 * @param relPosixPath - path relative to `.agents/notes/`.
 * @param content - full file content.
 * @returns one human-readable violation per problem; empty when the note
 * conforms or the path is a counterpart the pairing gate owns.
 */
export function findFormatViolations(relPosixPath: string, content: string): string[] {
  const note = parseNotePath(relPosixPath)
  if (note === null) return []
  if (relPosixPath.endsWith('.zh.md')) return []

  const violations: string[] = []
  const fail = (message: string): void => {
    violations.push(`${relPosixPath}: ${message}`)
  }
  const lines = content.split('\n')
  const hasHeading = (name: string): boolean => lines.includes(name)

  if (!/^# Agent Note: .+/.test(lines[0] ?? '')) fail('line 1 must be "# Agent Note: <title>"')
  if (lines[1] !== '') fail('line 2 must be blank')

  const status = lines[2] ?? ''
  if (note.lifecycle === 'proposed' && status !== 'Status: proposed') {
    fail('a proposed note carries exactly "Status: proposed"')
  }
  if ((note.lifecycle === 'implemented' || note.lifecycle === 'archived') && status !== 'Status: implemented') {
    fail(`an ${note.lifecycle} note carries exactly "Status: implemented"`)
  }
  if (note.lifecycle === 'rejected' && !/^Status: rejected — .+/.test(status)) {
    fail('a rejected note carries "Status: rejected — <one-line why>"')
  }
  if (note.lifecycle === 'archived' && !ARCHIVED_LINE.test(lines[3] ?? '')) {
    fail('an archived note carries "Archived: YYYY-MM-DD" as its fourth line')
  }

  const firstHeading = lines.find(line => line.startsWith('## '))
  if (firstHeading !== '## Problem') fail('the body must open with "## Problem"')

  // The escape comment stands in place of the alternatives section, so it
  // exempts that section from the skeleton as well as from the mandate.
  const hasEscape = lines.includes(ALTERNATIVES_ESCAPE)
  for (const section of REQUIRED_SECTIONS[note.lifecycle]) {
    if (section === '## Alternatives considered' && hasEscape) continue
    if (!hasHeading(section)) fail(`missing required section "${section}"`)
  }
  if (note.lifecycle === 'implemented' || note.lifecycle === 'archived') {
    for (const heading of FORBIDDEN_AFTER_SHIPPING) {
      if (hasHeading(heading)) fail(`proposal-era heading "${heading}" is rejected once shipped`)
    }
  }

  if (!hasHeading('## Alternatives considered') && !hasEscape) {
    fail('missing "## Alternatives considered" (or the exact pre-format escape comment)')
  }

  return violations
}

function collectNotesCorpus(notesDir: string): Array<[string, string]> {
  const corpus: Array<[string, string]> = []
  for (const rel of collectNotePaths(notesDir)) {
    if (rel === 'README.md' || rel === 'README.zh.md') continue
    corpus.push([rel, readFileSync(resolve(notesDir, rel), 'utf8')])
  }
  return corpus
}

// Entry guards compare URLs: import.meta.main is unreliable under
// loader-based TS execution outside the invoking project.
const isEntry =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isEntry) {
  const notesDir = resolve(import.meta.dirname, '..', '.agents', 'notes')
  const violations = collectNotesCorpus(notesDir).flatMap(([rel, content]) =>
    findFormatViolations(rel, content),
  )
  if (violations.length > 0) {
    console.error(`verify-agent-note-format: ${violations.length} violation(s):\n${violations.map(line => `  - ${line}`).join('\n')}`)
    process.exitCode = 1
  } else {
    const checked = collectNotesCorpus(notesDir).length
    console.log(`verify-agent-note-format: ${checked} note(s) conform.`)
  }
}
