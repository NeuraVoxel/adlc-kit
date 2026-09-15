# 架构

中文 | [English](architecture.md)

adlc-kit-ts 是 adlc-kit 系列的 TypeScript 参考 kit。本文是改动 `server/`、`apps/web/`、`packages/`、`scripts/` 前的必读地图；决策理由在 [Agent Notes](../.agents/notes/README.md)，逐步操作指南不在本文。

## 组成

| 目录 | 职责 |
|---|---|
| `apps/web/` | React + Vite 前端；浏览器编译面（bundler resolution、DOM lib）；产物不得触达 Node API |
| `server/` | Fastify 后端；Node 编译面（NodeNext）；tsx 直接执行 TS；暴露 `GET /health` |
| `packages/contracts/` | 跨端契约源。第三步成为生成物家园（gen/verify 成对 + 双端 same-PR）；现阶段保存手写的唯一事实源 |
| `packages/create-adlc-kit-ts/` | 安装器：从本 checkout 脚手架新项目，或把规则组件采纳进既有项目；checkout 即模板 |
| `scripts/` | `run-gates.ts` 门禁编排与 verify 脚本；语言无关的基础设施，不 import 业务代码 |
| `docs/` | 架构地图（本文）、[测试策略](testing.zh.md)与[发版合同](release.zh.md) |
| `.agents/` | 决策记录（`notes/`）、灵感 inbox 与学习复盘、以及 `kit-*` 工作流技能 |

## 语言策略

面向人的合同以英文为主档，同一变更内更新 `.zh.md` 中文对照：`README.md`、`docs/*.md`、`.agents/notes/**/*.md`，以及 inbox 与 learning 的 README。`AGENTS.md` 与 `.agents/skills/*/SKILL.md` 保持纯英文——面向 agent，以约束模型上下文（[配对决策](../.agents/notes/implemented/process/2026-09-15-bilingual-doc-pairing.md)）。inbox spark、`QUEUE.md`、学习笔记与 `ChangeLog.md` 有意保持单语，在配对门禁之外。`pnpm run doc-sync` 拒绝缺失、孤儿或结构漂移的对照文件。

## 编译面（faces）

同一份 TypeScript 按四个 face 配置编译，各自独立 typecheck；共享的严格度选项在 `tsconfig.base.json`：

- `server/tsconfig.json` — NodeNext + node types；运行于 Node。
- `apps/web/tsconfig.json` — esnext + bundler resolution + DOM lib + react-jsx；为浏览器打包。
- `packages/contracts/tsconfig.json` — NodeNext；双端共享的类型源。
- `tsconfig.tools.json` — 仓库工具：`scripts/`、`vitest.config.ts`、安装器包。

face 自己拥有 `module`/`moduleResolution`/`lib`；不存在根级 solution 编译。跨包类型经由 `tsconfig.base.json` 的 `paths` 从源码解析（源码平面）；引入产物平面（如 tsdown）时先加 face 再加构建，绝不合并 face。

## 门禁体系

`pnpm run check:ci` 即 `scripts/run-gates.ts ci-primary`。runner 只做聚合图调度（spawn 命令、`needs` 依赖、有界并行、按阶段 fail-fast），不解析任何工具链——加一条泳道是加 Gate 定义，不是改 runner。当前图：

- `ci-primary`：lint、typecheck、test —— 单一并行阶段。
- `doc-sync`：双语文档配对。
- `check-all`：以上两者；CI 跑的就是它。

扩展点：

- **新 verify 门禁**：`scripts/verify-<invariant>.ts` + 配套 spec（证明拒绝一个非法用例），挂进 `gatesForMode`。
- **新泳道**（如 `ci-web`、`ci-python`）：扩展 `Mode` 联合与 `gatesForMode`；runner 本体不变。
- **UI 文案门禁**：引入 locale 字典时，配套 verify 门禁拒绝组件内硬编码文案。
- **端到端（第三步）**：`ci-e2e` 泳道，独立于单测泳道，无凭据自跳过。

Git 钩子分工：pre-commit 只做暂存文件的快速检查（lint --fix、行尾空白），pre-push 只跑 typecheck，CI 拥有穷举矩阵。本地检查点保持快速，是钩子不被绕过的代价。

## 跨栈接缝（第三步预告）

`packages/contracts` 只允许两种跨栈共享物：

1. **契约 schema** —— 各语言类型由它生成；禁止在任何语言里手写对端类型副本；生成物新鲜度由 gen/verify 成对门禁守护。
2. **提交在 git 里的 fixtures** —— 双端离线回放，这是每条泳道可独立验证的保障。

改契约的 PR 必须同一变更内更新 provider 与 consumer；活进程集成验证只存在于 `ci-e2e` 泳道。三阶段路线与组合规则：[Agent Note](../.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md)。安装器设计：[Agent Note](../.agents/notes/implemented/process/2026-09-15-create-adlc-kit-ts-installer.md)。
