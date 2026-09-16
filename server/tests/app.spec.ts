import { describe, expect, it } from 'vitest'
import { isHealthStatus } from '@adlc-kit/contracts'
import { createApp } from '../src/app.ts'

describe('GET /health', () => {
  it('reports ok with a numeric uptime, valid against the generated contract', async () => {
    const app = createApp()
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    const body: unknown = response.json()
    expect(isHealthStatus(body)).toBe(true)
    expect((body as { uptime_seconds: number }).uptime_seconds).toBeTypeOf('number')
  })
})
