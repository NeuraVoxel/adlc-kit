# Agent Note: create-adlc-kit-ts copies verified rules live from the checkout

Status: implemented

## Problem

kit 的价值在于它那套经过门禁验证的规则（AGENTS.md、门禁、钩子、notes 体系）。今天要把这套规则用进新项目，只能手工拷贝文件并祈祷没有遗漏；"脚手架全新项目"和"采纳进既有项目"需求不同；而快照式模板会静默分发门禁从未验证过的规则。

## Decision

`packages/create-adlc-kit-ts` 是零依赖的 TypeScript 安装器，有两种模式。`new <dir>` 把整个 checkout（剔除 `.git`、`node_modules`、`dist`、`coverage`、lockfile 与安装器自身）拷贝为新项目，把文本面上的 `@adlc-kit/*` 与 `adlc-kit-ts` 改名为 `--scope`/`--name`，并重建 `CLAUDE.md` 别名。`adopt [dir]` 把选中的组件（`rules`、`gates`、`docs`、`ci`）装进既有项目，把缺失的 runner 脚本合并进 `package.json`，不加 `--force` 时拒绝覆盖，并打印门禁图所依赖的 devDependency 与脚本前置条件。组件**从 checkout 实时拷贝**——不存在会漂移的模板快照；checkout 是唯一事实源，新项目收到的正是门禁刚刚验证过的规则。

## Alternatives considered

- **在安装器内做 `template/` 快照目录，用 gen/verify 成对门禁保新鲜**。落败原因：适合 npm 分发场景，但在安装器发布之前，快照只是每条规则的第二份拷贝，唯一作用就是漂移；实时拷贝把门禁和生成器都删掉了。发布时再以打包步骤的形式回来。
- **degit 或手工拷贝**。落败原因：degit 连 kit 元数据一起全量分发且不做任何改名；手工拷贝正是 kit 要消灭的错误。
- **交互式 prompts（如 @clack/prompts）**。推迟：带默认值的参数让安装器可脚本化且零依赖；等参数面变大再叠加交互。

## Consequences

安装器只能在 kit checkout 内运行，其 README 已记录；npm 分发（`pnpm create adlc-kit-ts`）是推迟的后续。采纳模式原样拷贝 AGENTS.md，采用者需自行删剪框架特定行——这一点打印在 next-steps 输出里而非结构上解决，在出现第二个 kit 能对照出"通用内核"之前，这是诚实做法。安装器包被排除在 `new` 模式拷贝之外，避免模板递归嵌套。
