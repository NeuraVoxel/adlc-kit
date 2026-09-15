/**
 * Generate the per-language contract artifacts from the schema source of
 * truth (`fixtures/schema/*.schema.json`).
 *
 * `--check` regenerates in memory and fails loud on any drift; `--write`
 * (the `gen:contracts` script) refreshes the committed artifacts. The mapper
 * supports the constructs the schemas use today — objects, required lists,
 * `additionalProperties: false`, string consts, and bounded integers — and
 * grows with the next construct a schema needs.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const SCHEMA_DIR = resolve(ROOT, 'fixtures', 'schema')
const TS_OUT = resolve(ROOT, 'packages', 'contracts', 'src', 'generated')
const PY_OUT = resolve(ROOT, 'python', 'src', 'adlc_kit', 'generated')

interface PropertySchema {
  type: 'string' | 'integer'
  const?: string
  minimum?: number
  description?: string
}
interface ObjectSchema {
  $schema?: string
  $id?: string
  title: string
  description?: string
  type: 'object'
  additionalProperties: false
  required: string[]
  properties: Record<string, PropertySchema>
}

function readSchema(name: string): ObjectSchema {
  const schema = JSON.parse(readFileSync(resolve(SCHEMA_DIR, name), 'utf8')) as ObjectSchema
  if (schema.type !== 'object' || !schema.title || !schema.required || !schema.properties) {
    throw new Error(`generate-contracts: ${name} is not a supported object schema.`)
  }
  return schema
}

function tsTypeOf(property: PropertySchema): string {
  if (property.const !== undefined) return JSON.stringify(property.const)
  if (property.type === 'integer') return 'number'
  return property.type
}

function tsCheck(name: string, property: PropertySchema): string {
  if (property.const !== undefined) {
    return `  if (record.${name} !== ${JSON.stringify(property.const)}) return false`
  }
  if (property.type === 'integer') {
    const bound = property.minimum !== undefined ? ` || record.${name} < ${property.minimum}` : ''
    return `  if (typeof record.${name} !== 'number' || !Number.isInteger(record.${name})${bound}) return false`
  }
  return `  if (typeof record.${name} !== '${property.type}') return false`
}

function generateTs(schema: ObjectSchema, schemaFile: string): string {
  const fields = schema.required
    .map(name => {
      const property = schema.properties[name]!
      const doc = property.description ? `  /** ${property.description} */\n` : ''
      return `${doc}  ${name}: ${tsTypeOf(property)}`
    })
    .join('\n')
  const keys = JSON.stringify([...schema.required].sort())
  const sizeCheck = `  const keys = Object.keys(record).sort()\n  const expected = ${keys}\n  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) return false`
  const checks = schema.required.map(name => tsCheck(name, schema.properties[name]!)).join('\n')
  return `// Generated from fixtures/schema/${schemaFile} by scripts/generate-contracts.ts.
// Do not edit: regenerate with \`pnpm run gen:contracts\`.

/** ${schema.description ?? schema.title} */
export interface ${schema.title} {
${fields}
}

/** Validate an unknown wire value against the schema; wire boundaries only. */
export function is${schema.title}(value: unknown): value is ${schema.title} {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
${sizeCheck}
${checks}
  return true
}
`
}

function pyField(name: string, property: PropertySchema): string {
  if (property.const !== undefined) return `    ${name}: Literal[${JSON.stringify(property.const)}]`
  if (property.type === 'integer' && property.minimum !== undefined) {
    return `    ${name}: int = Field(ge=${property.minimum})`
  }
  return `    ${name}: ${property.type}`
}

function generatePy(schema: ObjectSchema, schemaFile: string): string {
  const fields = schema.required.map(name => pyField(name, schema.properties[name]!)).join('\n')
  return `"""Generated from fixtures/schema/${schemaFile} by scripts/generate-contracts.ts.

Do not edit: regenerate with \`\`pnpm run gen:contracts\`\`.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ${schema.title}(BaseModel):
    """${schema.description ?? schema.title}"""

    model_config = {"extra": "forbid"}

${fields}
`
}

const schemas = ['health.schema.json']
const outputs: Array<{ path: string; content: string }> = schemas.flatMap(schemaFile => {
  const schema = readSchema(schemaFile)
  const base = schemaFile.replace(/\.schema\.json$/, '')
  return [
    { path: resolve(TS_OUT, `${base}.ts`), content: generateTs(schema, schemaFile) },
    { path: resolve(PY_OUT, `${base}.py`), content: generatePy(schema, schemaFile) },
  ]
})

const check = process.argv.includes('--check')
if (check) {
  const drifted = outputs.filter(({ path, content }) => readFileSync(path, 'utf8') !== content)
  if (drifted.length > 0) {
    console.error(
      `generate-contracts: ${drifted.length} artifact(s) drifted from the schema:\n${drifted.map(({ path }) => `  - ${path}`).join('\n')}\nRun \`pnpm run gen:contracts\` and commit the refresh.`,
    )
    process.exitCode = 1
  } else {
    console.log(`generate-contracts: ${outputs.length} artifact(s) fresh.`)
  }
} else {
  mkdirSync(TS_OUT, { recursive: true })
  mkdirSync(PY_OUT, { recursive: true })
  for (const { path, content } of outputs) writeFileSync(path, content)
  console.log(`generate-contracts: wrote ${outputs.length} artifact(s).`)
}
