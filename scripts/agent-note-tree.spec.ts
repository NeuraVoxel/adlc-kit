import { describe, expect, it } from 'vitest'
import { CLASSES, LIFECYCLES, findTreeViolations, parseNotePath } from './agent-note-tree.ts'

describe('parseNotePath', () => {
  it('parses every lifecycle and class', () => {
    for (const lifecycle of LIFECYCLES) {
      for (const noteClass of CLASSES) {
        const parsed = parseNotePath(`${lifecycle}/${noteClass}/2026-09-15-topic.md`)
        expect(parsed).toEqual({ lifecycle, noteClass, date: '2026-09-15', topic: 'topic' })
      }
    }
  })

  it('rejects an unknown lifecycle', () => {
    expect(parseNotePath('done/architecture/2026-09-15-topic.md')).toBeNull()
  })

  it('rejects an unknown class', () => {
    expect(parseNotePath('implemented/refactor/2026-09-15-topic.md')).toBeNull()
  })

  it('rejects wrong depth', () => {
    expect(parseNotePath('implemented/2026-09-15-topic.md')).toBeNull()
    expect(parseNotePath('a/implemented/architecture/2026-09-15-topic.md')).toBeNull()
  })

  it('rejects a malformed date or non-note file', () => {
    expect(parseNotePath('implemented/architecture/2026-9-1-topic.md')).toBeNull()
    expect(parseNotePath('implemented/architecture/notes.txt')).toBeNull()
  })

  it('accepts zh counterparts', () => {
    const parsed = parseNotePath('implemented/process/2026-09-15-topic.zh.md')
    expect(parsed).toEqual({ lifecycle: 'implemented', noteClass: 'process', date: '2026-09-15', topic: 'topic' })
  })
})

describe('findTreeViolations', () => {
  it('accepts a well-classified corpus and the README pair', () => {
    expect(
      findTreeViolations([
        'README.md',
        'README.zh.md',
        'implemented/process/2026-09-15-topic.md',
        'proposed/architecture/2026-09-14-idea.md',
      ]),
    ).toEqual([])
  })

  it('reports each unclassifiable path', () => {
    const violations = findTreeViolations([
      'implemented/refactor/2026-09-15-topic.md',
      'done/architecture/2026-09-15-topic.md',
    ])
    expect(violations).toHaveLength(2)
    expect(violations[0]).toContain('unclassifiable note path')
  })
})
