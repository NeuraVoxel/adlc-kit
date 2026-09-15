import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.ts'

describe('GET /health', () => {
  it('reports ok with a numeric uptime', async () => {
    const app = createApp()
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    const body: unknown = response.json()
    expect(body).toMatchObject({ status: 'ok' })
    expect((body as { uptimeSeconds: number }).uptimeSeconds).toBeTypeOf('number')
  })
})
