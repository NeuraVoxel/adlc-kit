# 架构

中文 | [English](architecture.md)

adlc-kit 是 adlc-kit 系列的集成形态：TypeScript 各面与 Python 面同仓共存，由契约管线衔接。本文是改动 `server/`、`apps/web/`、`python/`、`packages/`、`scripts/` 前的必读地图；决策理由在 [Agent Notes](../.agents/notes/README.md)。

## 组成

| 目录 | 职责 |
|---|---|
| `apps/web/` | React + Vite 前端；浏览器面（bundler resolution、DOM lib）；产物不得触达 Node API |
| `server/` | Fastify 后端；Node 面（NodeNext）；`GET /health` 经生成的契约校验 |
| `python/` | FastAPI 服务；Python 面（uv 托管、strict mypy）；经生成的 pydantic 模型暴露同一 `/health` 契约 |
| `packages/contracts/` | 生成的 TypeScript wire 产物；唯一手写文件是 `index.ts` 再导出 |
| `fixtures/` | 接缝：`schema/*.schema.json` 是唯一手工维护的 wire 契约；JSON 文件由双面离线回放 |
| `scripts/` | `run-gates.ts` 编排器、verify 门禁、契约生成器与 e2e 引导 |
| `docs/` | 架构地图（本文）、[测试策略](testing.zh.md)与[发版合同](release.zh.md) |
| `.agents/` | 决策记录（`notes/`）、灵感 inbox 与学习复盘、`kit-*` 工作流技能 |

## 契约管线

`fixtures/schema/` 是事实源。`pnpm run gen:contracts` 产出 `packages/contracts/src/generated/*.ts`（接口 + 运行时校验器）与 `python/src/adlc_kit/generated/*.py`（pydantic 模型）；`generate-contracts.ts --check` 对任何漂移失败。schema 变更须同一变更内更新 provider 与 consumer；`ci-contracts` 让双面离线回放提交的 fixtures。任何地方手写 wire 类型都是禁止的——接缝规则在[packages/AGENTS.md](../packages/AGENTS.md)。

## 面与工具链

| 面 | 运行时 | 类型 | 门禁 |
|---|---|---|---|
| `server/` + `apps/web/` + `packages/` | Node 22、pnpm、tsx | `tsconfig.base.json` 下的 NodeNext / bundler / NodeNext face | oxlint、tsc、vitest |
| `python/` | uv 托管 Python 3.12 | pydantic 模型、strict mypy | ruff（lint + format）、mypy、pytest |

两套工具链都是一等公民：runner 把它们当泳道对待，不是主从关系。

## 门禁体系

`pnpm run check:all` 是 CI 跑的。runner 只做聚合图调度，不解析任何工具链——加一条泳道是加 Gate 定义，不是改 runner。当前图：

- `ci-primary`：lint、typecheck、test —— TypeScript 各面。
- `ci-python`：py-lint、py-format、py-typecheck、py-test——每条把工作目录（`cwd`）设在 Python 根。
- `ci-contracts`：schema/产物新鲜度，加 TypeScript 与 Python 两路 fixture 回放。
- `doc-sync`：双语文档配对、note 分类、note 格式、归档完整性。
- `ci-e2e`：活进程跨栈检查——真实套接字拉起 Python 服务，用 TypeScript 生成校验器验证其 `/health` 载荷。唯一需要活进程的泳道。

Git 钩子分工：pre-commit 只做暂存文件的快速检查（lint --fix、行尾空白），pre-push 跑 TypeScript typecheck，CI 拥有穷举矩阵。

## 路线图渊源

本仓库是三阶段路线图的第三阶段：`adlc-kit-ts` 与 `adlc-kit-py` 先各自独立验证；本 kit 是二者的组合加上契约管线，不是第三个从零建的骨架。路线图与组合规则：[adlc-kit-ts 中的路线图 Note](https://github.com/NeuraVoxel/adlc-kit-ts/blob/main/.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md)；本 kit 的装配决策：[组装 Note](../.agents/notes/implemented/process/2026-09-15-assemble-adlc-kit.md)。
