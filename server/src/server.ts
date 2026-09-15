import { createApp } from './app.ts'

const port = Number(process.env['PORT'] ?? 3000)
const host = process.env['HOST'] ?? '127.0.0.1'

const app = createApp()
await app.listen({ port, host })
console.log(`adlc-kit-ts server listening on http://${host}:${port}`)
