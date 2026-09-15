/** Contract replay: both faces validate the same committed fixtures against
 * their generated artifacts — the offline half of the cross-stack seam. */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { isHealthStatus } from '../src/generated/health.ts'

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(resolve(import.meta.dirname, '..', '..', '..', 'fixtures', name), 'utf8'))

describe('generated HealthStatus against shared fixtures', () => {
  it('accepts the passing fixture', () => {
    expect(isHealthStatus(fixture('health.pass.json'))).toBe(true)
  })

  it('rejects the rejected fixture', () => {
    expect(isHealthStatus(fixture('health.rejected.json'))).toBe(false)
  })

  it('rejects an unknown property', () => {
    expect(isHealthStatus({ status: 'ok', uptime_seconds: 1, extra: true })).toBe(false)
  })
})
