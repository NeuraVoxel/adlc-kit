# adlc-kit

中文 | [English](README.md)

adlc-kit 系列的集成形态：TypeScript 各面（Fastify server、React web）与 Python 面（FastAPI 服务）同仓共存，由契约管线衔接——JSON Schema 单一事实源、按语言生成的产物、双端离线回放的共享 fixtures、以及一条活进程跨栈 e2e 泳道。

## 快速开始

```sh
pnpm install                                   # TypeScript 工具链 + lefthook 钩子
uv sync --project python                       # Python 环境（托管 3.12）
pnpm run check:all                             # 全部泳道：TS + Python + 契约 + 文档 + e2e
pnpm run dev:server                            # Node 面，http://127.0.0.1:3000/health
pnpm run dev:python                            # Python 面，http://127.0.0.1:8000/health
pnpm run dev:web                               # Vite dev server
```

## 目录

| 目录 | 职责 |
|---|---|
| `apps/web/` | React + Vite 前端（浏览器面） |
| `server/` | Fastify 后端（Node 面） |
| `python/` | FastAPI 服务（Python 面），uv 托管 |
| `packages/contracts/` | 生成的 TypeScript wire 类型；消费方经 `@adlc-kit/contracts` 导入 |
| `fixtures/` | 跨栈接缝：`schema/` 是事实源，JSON 文件由双面离线回放 |
| `scripts/` | `run-gates.ts` 编排器、verify 门禁与契约生成器 |
| `docs/` | 架构地图、测试策略、发版合同 |
| `.agents/` | 决策记录、灵感 inbox、学习复盘、`kit-*` 技能 |

文档以英文为主档配 `.zh.md` 对照；`doc-sync` 拒绝漂移。`AGENTS.md`（面向 agent）仅英文。每个模块子树有自己的 `AGENTS.md` 补充。

## 契约管线

1. 编辑 `fixtures/schema/*.schema.json`——唯一手工维护的 wire 契约。
2. `pnpm run gen:contracts` 再生 `packages/contracts/src/generated/*.ts` 与 `python/src/adlc_kit/generated/*.py`。
3. 同一变更内更新 provider 与 consumer；`ci-contracts` 对任何产物漂移失败（`--check`），并让双面离线回放共享 fixtures。
4. `ci-e2e` 在真实套接字上拉起 Python 服务，用 TypeScript 生成校验器验证其线上 `/health` 载荷。

任何地方手写 wire 类型都是禁止的。接缝规则：[packages/AGENTS.md](packages/AGENTS.md)。

## 门禁

`pnpm run check:all` 运行每条泳道：`ci-primary`（lint/typecheck/test）、`ci-python`（ruff/mypy/pytest）、`ci-contracts`（新鲜度 + 双端回放）、`doc-sync`（配对 + notes 门禁）与 `ci-e2e`（活进程跨栈检查）。CI 跑同一聚合（[.github/workflows/ci.yml](.github/workflows/ci.yml)）；pre-commit 保持快速，CI 拥有穷举矩阵。

## adlc-kit 系列

`adlc-kit-ts`（第一步）→ `adlc-kit-py`（第二步）→ `adlc-kit`（本仓库，第三步）。路线图与组合规则：[adlc-kit-ts 中的路线图 Note](https://github.com/NeuraVoxel/adlc-kit-ts/blob/main/.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md)。
