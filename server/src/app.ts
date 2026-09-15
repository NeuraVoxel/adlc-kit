import Fastify, { type FastifyInstance } from 'fastify'
import type { HealthStatus } from '@adlc-kit/contracts'

/** Build the Fastify application without binding a port; tests drive it via `inject()`. */
export function createApp(): FastifyInstance {
  const app = Fastify()

  app.get('/health', async (): Promise<HealthStatus> => ({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
  }))

  return app
}
