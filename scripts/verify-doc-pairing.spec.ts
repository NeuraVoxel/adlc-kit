import { describe, expect, it } from 'vitest'
import { findPairingViolations, pairingExemptions } from './verify-doc-pairing.ts'

const corpus = (entries: Record<string, string>): Map<string, string> => new Map(Object.entries(entries))

describe('findPairingViolations', () => {
  it('accepts a fully paired corpus', () => {
    const files = corpus({
      'docs/guide.md': '# Guide\n## Setup\n',
      'docs/guide.zh.md': '# 指南\n## Setup\n',
    })
    expect(findPairingViolations(files)).toEqual([])
  })

  it('rejects a missing counterpart', () => {
    const violations = findPairingViolations(corpus({ 'docs/guide.md': '## A\n' }))
    expect(violations).toEqual([expect.stringContaining('missing counterpart: docs/guide.md')])
  })

  it('rejects an orphan counterpart', () => {
    const violations = findPairingViolations(corpus({ 'docs/guide.zh.md': '## A\n' }))
    expect(violations).toEqual([expect.stringContaining('orphan counterpart')])
  })

  it('rejects section drift between counterparts', () => {
    const violations = findPairingViolations(
      corpus({ 'docs/guide.md': '## A\n## B\n', 'docs/guide.zh.md': '## A\n' }),
    )
    expect(violations[0]).toContain('section drift')
  })

  it('rejects fenced-block drift between counterparts', () => {
    const violations = findPairingViolations(
      corpus({ 'docs/guide.md': '## A\n```sh\nls\n```\n', 'docs/guide.zh.md': '## A\n' }),
    )
    expect(violations[0]).toContain('fence drift')
  })

  it('accepts an explicitly exempted primary file without a counterpart', () => {
    const exemptPath = Object.keys(pairingExemptions)[0]!
    expect(findPairingViolations(corpus({ [exemptPath]: '## A\n' }))).toEqual([])
  })
})
