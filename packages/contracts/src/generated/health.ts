// Generated from fixtures/schema/health.schema.json by scripts/generate-contracts.ts.
// Do not edit: regenerate with `pnpm run gen:contracts`.

/** Payload of GET /health, served by the Node and Python faces. */
export interface HealthStatus {
  status: "ok"
  uptime_seconds: number
}

/** Validate an unknown wire value against the schema; wire boundaries only. */
export function isHealthStatus(value: unknown): value is HealthStatus {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  const keys = Object.keys(record).sort()
  const expected = ["status","uptime_seconds"]
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) return false
  if (record.status !== "ok") return false
  if (typeof record.uptime_seconds !== 'number' || !Number.isInteger(record.uptime_seconds) || record.uptime_seconds < 0) return false
  return true
}
