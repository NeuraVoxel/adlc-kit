# Agent Note: create-adlc-kit-ts copies verified rules live from the checkout

Status: implemented

## Problem

The kit's value is its verified rule set (AGENTS.md, gates, hooks, notes system). Using it in a new project today means hand-copying files and hoping nothing is missed; "scaffold a fresh project" and "adopt into an existing project" have different needs; and a snapshot template would silently ship rules the gates never verified.

## Decision

`packages/create-adlc-kit-ts` is a zero-dependency TypeScript installer with two modes. `new <dir>` copies the whole checkout (minus `.git`, `node_modules`, `dist`, `coverage`, the lockfile, and the installer package itself) into a fresh project, renames `@adlc-kit/*` and `adlc-kit-ts` to `--scope`/`--name` across text surfaces, and recreates the `CLAUDE.md` alias. `adopt [dir]` installs selected components (`rules`, `gates`, `docs`, `ci`) into an existing project, merges the missing runner scripts into `package.json`, refuses to overwrite without `--force`, and prints the dev-dependency and script prerequisites the gate graph assumes. Components copy **live from the checkout** — there is no template snapshot to drift; the checkout is the single source of truth, so a new project receives exactly the rules the gates just verified.

## Alternatives considered

- **Snapshot a `template/` directory inside the installer, freshness-gated by a gen/verify pair.** Lost: right for npm distribution, but until the installer is published the snapshot is a second copy of every rule whose only purpose is to drift; the live copy deletes both the gate and the generator. Revisit at publish time as a pack step.
- **degit or manual copying.** Lost: degit ships everything including kit meta and renames nothing; manual copying is exactly the error the kit exists to prevent.
- **Interactive prompts (for example @clack/prompts).** Deferred: flags with defaults keep the installer scriptable and dependency-free; prompts can layer on when the flag surface grows.

## Consequences

The installer only runs from a kit checkout, which its README records; npm distribution (`pnpm create adlc-kit-ts`) is the deferred follow-up. Adoption copies AGENTS.md as-is, so adopters prune framework-specific lines themselves — printed in the next-steps output rather than solved structurally, which stays honest until a second kit exists to show what the generic core is. The installer package is excluded from `new`-mode copies, preventing recursive template embedding.
