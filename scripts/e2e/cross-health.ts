/**
 * Live cross-stack verification: boot the Python face on a real socket and
 * validate its /health wire response with the TypeScript generated
 * validator against the shared fixture. This is the only lane where a live
 * process is required — everything else replays committed files offline.
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const PORT = 8123
const URL = `http://127.0.0.1:${PORT}/health`
const READY_TIMEOUT_MS = 15_000

const child = spawn(
  'uv',
  ['run', 'uvicorn', 'adlc_kit.app:app', '--host', '127.0.0.1', '--port', String(PORT)],
  { cwd: resolve(ROOT, 'python'), stdio: 'ignore' },
)

async function waitForReady(): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`cross-health: python service exited early with code ${child.exitCode}.`)
    }
    try {
      const response = await fetch(URL)
      if (response.ok) return
    } catch {
      // not ready yet; poll until the deadline
    }
    await new Promise(resolveDelay => setTimeout(resolveDelay, 200))
  }
  throw new Error(`cross-health: python service not ready within ${READY_TIMEOUT_MS}ms.`)
}

try {
  await waitForReady()
  const response = await fetch(URL)
  const payload: unknown = await response.json()
  const { isHealthStatus } = await import('../../packages/contracts/src/generated/health.ts')
  if (!isHealthStatus(payload)) {
    console.error('cross-health: live /health payload does not satisfy the generated contract.')
    process.exitCode = 1
  } else {
    const fixture = JSON.parse(
      readFileSync(resolve(ROOT, 'fixtures', 'health.pass.json'), 'utf8'),
    ) as Record<string, unknown>
    const shapeMatchesFixture = Object.keys(payload).every(
      key => key in fixture && payload[key as keyof typeof payload] !== undefined,
    )
    if (!shapeMatchesFixture) {
      console.error('cross-health: live payload shape drifted from the shared fixture.')
      process.exitCode = 1
    } else {
      console.log('cross-health: live Python /health satisfies the TypeScript contract and fixture shape.')
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  child.kill('SIGTERM')
  await new Promise(resolveClose => child.on('close', resolveClose))
}
