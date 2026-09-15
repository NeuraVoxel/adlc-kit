import { describe, expect, it } from 'vitest'
import { findArchiveViolations, noteHash } from './verify-archived-agent-notes.ts'

const note = '# Agent Note: old\n\nStatus: implemented\nArchived: 2026-09-15\n\n## Problem\n'
const noteZh = '# Agent Note: old\n\nStatus: implemented\nArchived: 2026-09-15\n\n## Problem\n'
const enRel = 'archived/process/2026-09-15-old.md'
const zhRel = 'archived/process/2026-09-15-old.zh.md'

describe('findArchiveViolations', () => {
  it('accepts a sealed pair recorded in the manifest', () => {
    const files = new Map([
      [enRel, note],
      [zhRel, noteZh],
    ])
    const manifest = { [enRel]: noteHash(note), [zhRel]: noteHash(noteZh) }
    expect(findArchiveViolations(files, manifest)).toEqual([])
  })

  it('rejects modified frozen content', () => {
    const files = new Map([[enRel, `${note}edited\n`]])
    const manifest = { [enRel]: noteHash(note) }
    const violations = findArchiveViolations(files, manifest)
    expect(violations.join('\n')).toContain('frozen content modified')
  })

  it('rejects an archived file missing from the manifest', () => {
    const violations = findArchiveViolations(new Map([[enRel, note]]), {})
    expect(violations.join('\n')).toContain('unrecorded archived note')
  })

  it('rejects a manifest entry whose file is gone', () => {
    const violations = findArchiveViolations(new Map(), { [enRel]: noteHash(note) })
    expect(violations.join('\n')).toContain('manifest entry without file')
  })

  it('rejects an English note without its Chinese counterpart', () => {
    const files = new Map([[enRel, note]])
    const manifest = { [enRel]: noteHash(note) }
    const violations = findArchiveViolations(files, manifest)
    expect(violations.join('\n')).toContain('incomplete pair')
  })

  it('ignores non-archived paths', () => {
    const files = new Map([['implemented/process/2026-09-15-live.md', 'anything']])
    expect(findArchiveViolations(files, {})).toEqual([])
  })
})
