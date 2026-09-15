/**
 * Run local and CI quality gates with bounded parallel scheduling.
 *
 * Package scripts own public aggregate names; this runner owns their
 * dependency graph. Gates are plain commands — the runner never parses
 * the toolchain behind them, so adding a lane (for example `ci-python`)
 * adds Gate definitions, not runner changes.
 */
import { spawn } from 'node:child_process'
import { availableParallelism } from 'node:os'
import { resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'

/** One command and its dependency metadata inside one aggregate. */
export interface Gate {
  id: string
  label: string
  /** argv passed to spawn; never interpreted by this runner. */
  command: [string, ...string[]]
  /** Gate ids that must succeed before this gate starts. */
  needs?: string[]
  /** Working directory for the command, relative to the repository root. */
  cwd?: string
}

/** A named aggregate exposed by the gate runner. */
export type Mode = 'ci-primary' | 'ci-python' | 'ci-contracts' | 'ci-e2e' | 'doc-sync' | 'check-all'

/** The observed outcome of one gate process. */
export interface GateResult {
  gate: Gate
  exitCode: number | null
  durationMs: number
}

/**
 * Resolve the mode from CLI argv.
 * @param raw - the first CLI argument, if any.
 * @returns the selected aggregate.
 * @throws when the argument is not a known aggregate name.
 */
export function parseMode(raw: string | undefined): Mode {
  switch (raw) {
    case 'ci-primary':
    case 'ci-python':
    case 'ci-contracts':
    case 'ci-e2e':
    case 'doc-sync':
    case 'check-all':
      return raw
    default:
      throw new Error(
        `run-gates: expected mode ci-primary | ci-python | ci-contracts | ci-e2e | doc-sync | check-all, got ${JSON.stringify(raw ?? '')}.`,
      )
  }
}

/**
 * The gate graph for one aggregate.
 * @param mode - the selected aggregate.
 * @returns the gates to run, in no particular order.
 */
export function gatesForMode(mode: Mode): Gate[] {
  switch (mode) {
    case 'ci-primary':
      return [
        { id: 'lint', label: 'oxlint', command: ['pnpm', 'run', 'lint'] },
        { id: 'typecheck', label: 'tsc --noEmit across faces', command: ['pnpm', 'run', 'typecheck'] },
        { id: 'test', label: 'vitest run', command: ['pnpm', 'run', 'test'] },
      ]
    case 'ci-python':
      return [
        { id: 'py-lint', label: 'ruff check', command: ['uv', 'run', 'ruff', 'check', '.'], cwd: 'python' },
        {
          id: 'py-format',
          label: 'ruff format --check',
          command: ['uv', 'run', 'ruff', 'format', '--check', '.'],
          cwd: 'python',
        },
        { id: 'py-typecheck', label: 'mypy strict', command: ['uv', 'run', 'mypy'], cwd: 'python' },
        { id: 'py-test', label: 'pytest', command: ['uv', 'run', 'pytest'], cwd: 'python' },
      ]
    case 'ci-contracts':
      return [
        {
          id: 'contracts-fresh',
          label: 'generated artifacts match the schema',
          command: ['pnpm', 'exec', 'tsx', 'scripts/generate-contracts.ts', '--check'],
        },
        {
          id: 'contracts-test-ts',
          label: 'TypeScript fixture replay',
          command: ['pnpm', 'exec', 'vitest', 'run', 'packages/contracts'],
        },
        {
          id: 'contracts-test-py',
          label: 'Python fixture replay',
          command: ['uv', 'run', 'pytest', 'tests/test_contracts.py'],
          cwd: 'python',
        },
      ]
    case 'ci-e2e':
      return [
        {
          id: 'e2e-cross',
          label: 'live Python service checked by the TypeScript validator',
          command: ['pnpm', 'exec', 'tsx', 'scripts/e2e/cross-health.ts'],
        },
      ]
    case 'doc-sync':
      return [
        {
          id: 'doc-pairing',
          label: 'bilingual doc pairing',
          command: ['pnpm', 'exec', 'tsx', 'scripts/verify-doc-pairing.ts'],
        },
        {
          id: 'agent-note-tree',
          label: 'agent note classification',
          command: ['pnpm', 'exec', 'tsx', 'scripts/agent-note-tree.ts'],
        },
        {
          id: 'agent-note-format',
          label: 'agent note format',
          command: ['pnpm', 'exec', 'tsx', 'scripts/verify-agent-note-format.ts'],
        },
        {
          id: 'archived-agent-notes',
          label: 'frozen archive integrity',
          command: ['pnpm', 'exec', 'tsx', 'scripts/verify-archived-agent-notes.ts'],
        },
      ]
    case 'check-all':
      return [
        ...gatesForMode('ci-primary'),
        ...gatesForMode('ci-python'),
        ...gatesForMode('ci-contracts'),
        ...gatesForMode('doc-sync'),
        ...gatesForMode('ci-e2e'),
      ]
  }
}

/**
 * Order gates into sequential stages of parallelizable ids by `needs`.
 * @param gates - the aggregate's gates.
 * @returns stage batches in execution order.
 * @throws on duplicate ids, a `needs` entry pointing at no gate, or a cycle —
 * planning failures fail loud before any gate starts.
 */
export function planStages(gates: Gate[]): string[][] {
  const ids = new Set(gates.map(gate => gate.id))
  if (ids.size !== gates.length) throw new Error('run-gates: duplicate gate id in aggregate.')
  for (const gate of gates) {
    for (const need of gate.needs ?? []) {
      if (!ids.has(need)) throw new Error(`run-gates: gate ${gate.id} needs unknown gate ${need}.`)
    }
  }
  const remaining = new Map(gates.map(gate => [gate.id, new Set(gate.needs ?? [])]))
  const stages: string[][] = []
  while (remaining.size > 0) {
    const ready = [...remaining].filter(([, needs]) => needs.size === 0).map(([id]) => id)
    if (ready.length === 0) throw new Error('run-gates: cycle in gate needs.')
    stages.push(ready)
    for (const id of ready) remaining.delete(id)
    for (const needs of remaining.values()) {
      for (const id of ready) needs.delete(id)
    }
  }
  return stages
}

/**
 * Resolve the default worker count for an aggregate.
 * @param total - gate count in the aggregate.
 * @param available - host CPU availability.
 * @returns the worker count.
 */
export function defaultConcurrency(total: number, available = availableParallelism()): number {
  return Math.min(total, available)
}

function runGate(gate: Gate): Promise<GateResult> {
  const startedAt = performance.now()
  return new Promise(resolve => {
    const child = spawn(gate.command[0], gate.command.slice(1), { stdio: 'inherit', cwd: gate.cwd })
    child.on('close', exitCode => {
      resolve({ gate, exitCode, durationMs: performance.now() - startedAt })
    })
    child.on('error', error => {
      console.error(`run-gates: failed to spawn ${gate.id}: ${error.message}`)
      resolve({ gate, exitCode: null, durationMs: performance.now() - startedAt })
    })
  })
}

async function main(args: string[]): Promise<number> {
  const mode = parseMode(args[0])
  const gates = gatesForMode(mode)
  const stages = planStages(gates)
  const concurrency = defaultConcurrency(gates.length)
  const startedAt = performance.now()
  console.log(`run-gates: ${mode} running ${gates.length} gate(s), concurrency ${concurrency}.`)

  let failed = false
  for (const stage of stages) {
    const stageGates = stage.map(id => gates.find(gate => gate.id === id)!)
    for (let index = 0; index < stageGates.length; index += concurrency) {
      const batch = stageGates.slice(index, index + concurrency)
      for (const gate of batch) console.log(`run-gates: [${gate.id}] start — ${gate.label}`)
      const results = await Promise.all(batch.map(runGate))
      for (const result of results) {
        const seconds = (result.durationMs / 1000).toFixed(1)
        const outcome = result.exitCode === 0 ? 'passed' : `FAILED (exit ${result.exitCode ?? 'spawn error'})`
        console.log(`run-gates: [${result.gate.id}] ${outcome} in ${seconds}s`)
      }
      if (results.some(result => result.exitCode !== 0)) {
        failed = true
        break
      }
    }
    if (failed) break
  }

  console.log(`run-gates: ${failed ? 'aggregate failed' : 'all gates passed'} in ${((performance.now() - startedAt) / 1000).toFixed(1)}s.`)
  return failed ? 1 : 0
}

// import.meta.main is unreliable under loader-based TS execution (tsx reports
// undefined for entry paths outside the invoking project), so compare URLs.
const isEntry =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isEntry) {
  process.exitCode = await main(process.argv.slice(2))
}
