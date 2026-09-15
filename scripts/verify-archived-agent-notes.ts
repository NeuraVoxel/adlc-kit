/**
 * Frozen-archive integrity: everything under `archived/` is append-only
 * history. Every archived file must be recorded in the manifest with its
 * sealed hash, every manifest entry must have its file, and each English
 * note must have its Chinese counterpart alongside it. Content rules of
 * archived notes belong to the format gate; this gate owns the freeze.
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/** The append-only record of sealed archive content: path → sha256. */
export type ArchiveManifest = Readonly<Record<string, string>>

/**
 * Hash one file's content the way the manifest records it.
 * @param content - full file content.
 * @returns the hex sha256 digest.
 */
export function noteHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Collect freeze violations across the archived tree.
 * @param files - map of repo-relative posix path → content, at minimum every
 * file under `archived/`.
 * @param manifest - the recorded sealed hashes.
 * @returns one human-readable violation per problem; empty when the archive
 * is intact.
 */
export function findArchiveViolations(
  files: ReadonlyMap<string, string>,
  manifest: ArchiveManifest,
): string[] {
  const violations: string[] = []
  const archived = new Map([...files].filter(([rel]) => rel.startsWith('archived/')))

  for (const [rel, content] of archived) {
    const sealed = manifest[rel]
    if (sealed === undefined) {
      violations.push(`unrecorded archived note: ${rel} (re-record the manifest in the same change)`)
      continue
    }
    if (noteHash(content) !== sealed) {
      violations.push(`frozen content modified: ${rel} (the archive is append-only)`)
    }
    if (rel.endsWith('.md') && !rel.endsWith('.zh.md')) {
      const counterpart = rel.replace(/\.md$/, '.zh.md')
      if (!archived.has(counterpart)) {
        violations.push(`incomplete pair: ${rel} has no ${counterpart} alongside it`)
      }
    }
  }

  for (const rel of Object.keys(manifest)) {
    if (!archived.has(rel)) violations.push(`manifest entry without file: ${rel}`)
  }

  return violations.sort()
}

function collectArchivedFiles(archiveDir: string): Map<string, string> {
  const files = new Map<string, string>()
  const walk = (dir: string): void => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.set(relative(archiveDir, abs).split('\\').join('/'), readFileSync(abs, 'utf8'))
      }
    }
  }
  walk(archiveDir)
  return files
}

// Entry guards compare URLs: import.meta.main is unreliable under
// loader-based TS execution outside the invoking project.
const isEntry =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isEntry) {
  const archiveDir = resolve(import.meta.dirname, '..', '.agents', 'notes', 'archived')
  const manifestPath = resolve(import.meta.dirname, 'archived-notes.manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ArchiveManifest
  const violations = findArchiveViolations(collectArchivedFiles(archiveDir), manifest)
  if (violations.length > 0) {
    console.error(`verify-archived-agent-notes: ${violations.length} violation(s):\n${violations.map(line => `  - ${line}`).join('\n')}`)
    process.exitCode = 1
  } else {
    console.log(`verify-archived-agent-notes: ${manifest ? Object.keys(manifest).length : 0} sealed file(s) intact.`)
  }
}
