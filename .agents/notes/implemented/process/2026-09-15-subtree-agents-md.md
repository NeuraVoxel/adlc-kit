# Agent Note: per-subtree AGENTS.md supplements

Status: implemented

## Problem

All engineering rules lived in the root `AGENTS.md`, so obligations that only make sense inside one module — how server responses relate to contracts, what the web bundle may import, what a component change in the installer must touch — had no home near the code they govern. The root file could not carry them without bloating the context every session loads.

## Decision

Four subtree instruction files supplement the root, following the deepseek-harness layering: `server/AGENTS.md`, `apps/web/AGENTS.md`, `packages/AGENTS.md` (one section per package: the contracts seam and the installer), and `scripts/AGENTS.md`. Each states only obligations specific to that tree, links the seam rules it depends on, and never restates root conventions; each carries a `CLAUDE.md` symlink. Subtree files ship with `new`-mode scaffolds via the whole-checkout copy but are deliberately absent from the `rules` adopt component — their paths describe this kit's layout, which an adopting project does not share. The root file gained one pointer line naming the four subtrees.

## Alternatives considered

- **One file per package (five files, splitting `packages/`).** Lost at this scale: deepseek-harness, with two orders of magnitude more packages, still keeps one group-level `packages/AGENTS.md`; two packages do not justify a file each.
- **Put the module-specific rules in root anyway.** Lost: every session pays the context cost for rules most work never touches, and the root file drifts toward the budget wall.
- **Wait for drift.** Lost: the seam rules (raw data, not presentation) and the installer's four-edit rule were already being restated in conversation; unwritten obligations are the ones that decay.

## Consequences

Rules now sit beside the code they govern, and the root file stays lean. The four files are obligations to keep current: a rule that stops being true in its subtree must move or die in the same change as the code. Adopt-mode projects get the root discipline only; if an adopter's layout converges on this kit's, they copy the subtree files themselves — the roadmap sync at tagged releases treats them as kit content.
