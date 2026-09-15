# AGENTS.md — server

Rules for the Fastify backend only; repo-wide conventions live in the root [AGENTS.md](../AGENTS.md) and are not restated here.

- **Node face only.** NodeNext resolution, executed on Node through tsx; nothing in this tree may be imported by `apps/web/`.
- **Contract first.** A new or changed response body starts as a type in `@adlc-kit/contracts` ([seam rules](../packages/AGENTS.md)); handlers annotate that type and never declare inline wire shapes.
- **Apps do not bind.** `createApp()` builds and decorates only; only `src/server.ts` reads `PORT`/`HOST` and listens. Tests drive Fastify `inject()` — never a live port.
- **Raw data out.** Responses carry domain data and persisted metadata; labels, display strings, and UI groupings are derived on the web side, and a field added "because a component needs it" belongs there instead ([seam rules](../packages/AGENTS.md)).
- **No build artifacts.** There is no `lib/` and no compile step; never write an import path that assumes emitted output.
