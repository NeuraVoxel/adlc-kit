import { describe, expect, it } from 'vitest'
import { ALTERNATIVES_ESCAPE, findFormatViolations } from './verify-agent-note-format.ts'

const implementedNote = [
  '# Agent Note: sample',
  '',
  'Status: implemented',
  '',
  '## Problem',
  'Why.',
  '',
  '## Decision',
  'What shipped.',
  '',
  '## Alternatives considered',
  '- **Other**. Lost: reasons.',
  '',
  '## Consequences',
  'Cost and benefit.',
].join('\n')

describe('findFormatViolations', () => {
  it('accepts a conforming implemented note', () => {
    expect(findFormatViolations('implemented/process/2026-09-15-sample.md', implementedNote)).toEqual([])
  })

  it('accepts all four lifecycle skeletons', () => {
    const proposed = [
      '# Agent Note: idea',
      '',
      'Status: proposed',
      '',
      '## Problem',
      '## Proposal',
      '## Alternatives considered',
      '## Acceptance criteria',
      '## Risks',
    ].join('\n')
    const rejected = [
      '# Agent Note: idea',
      '',
      'Status: rejected — superseded by another note',
      '',
      '## Problem',
      '## Proposal',
      '## Alternatives considered',
    ].join('\n')
    const archived = implementedNote.replace(
      'Status: implemented',
      'Status: implemented\nArchived: 2026-09-15',
    )
    expect(findFormatViolations('proposed/architecture/2026-09-15-idea.md', proposed)).toEqual([])
    expect(findFormatViolations('rejected/process/2026-09-15-idea.md', rejected)).toEqual([])
    expect(findFormatViolations('archived/process/2026-09-15-sample.md', archived)).toEqual([])
  })

  it('rejects a broken header block', () => {
    const violations = findFormatViolations(
      'implemented/process/2026-09-15-sample.md',
      implementedNote.replace('# Agent Note: sample\n\n', '# Agent Note: sample\n'),
    )
    expect(violations.join('\n')).toContain('line 2 must be blank')
  })

  it('rejects a status that disagrees with the lifecycle folder', () => {
    const violations = findFormatViolations(
      'implemented/process/2026-09-15-sample.md',
      implementedNote.replace('Status: implemented', 'Status: proposed'),
    )
    expect(violations.join('\n')).toContain('exactly "Status: implemented"')
  })

  it('rejects a rejected note without a reason', () => {
    const violations = findFormatViolations(
      'rejected/process/2026-09-15-idea.md',
      '# Agent Note: idea\n\nStatus: rejected\n\n## Problem\n## Proposal\n## Alternatives considered\n',
    )
    expect(violations.join('\n')).toContain('Status: rejected — <one-line why>')
  })

  it('rejects an archived note without the Archived line', () => {
    const violations = findFormatViolations(
      'archived/process/2026-09-15-sample.md',
      implementedNote,
    )
    expect(violations.join('\n')).toContain('"Archived: YYYY-MM-DD" as its fourth line')
  })

  it('rejects proposal-era headings under implemented and archived', () => {
    const violations = findFormatViolations(
      'implemented/process/2026-09-15-sample.md',
      `${implementedNote}\n\n## Acceptance criteria\n`,
    )
    expect(violations.join('\n')).toContain('proposal-era heading')
  })

  it('rejects a missing alternatives section unless the exact escape comment is present', () => {
    const stripped = implementedNote.replace('## Alternatives considered\n- **Other**. Lost: reasons.\n\n', '')
    const violations = findFormatViolations('implemented/process/2026-09-15-sample.md', stripped)
    expect(violations.join('\n')).toContain('missing "## Alternatives considered"')
    const escaped = `${stripped}\n${ALTERNATIVES_ESCAPE}\n`
    expect(findFormatViolations('implemented/process/2026-09-15-sample.md', escaped)).toEqual([])
  })

  it('skips Chinese counterparts and unclassifiable paths', () => {
    expect(findFormatViolations('implemented/process/2026-09-15-sample.zh.md', '')).toEqual([])
    expect(findFormatViolations('README.md', '')).toEqual([])
  })
})
