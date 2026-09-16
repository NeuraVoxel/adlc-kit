# Agent Note: assemble adlc-kit as the phase-3 integrated shape

Status: implemented

## Problem

路线图第三阶段要求混合 kit：两个技术栈同仓，加上真实的跨栈接缝。它要对抗的风险正是接缝现在必须承载的——平行手写的类型在语言之间漂移，以及只在有人碰巧同时启动两个服务时才存在的集成。

## Decision

由两个已验证的 kit（其内容、门禁与规则体系）加上契约管线与三条新泳道装配出 `adlc-kit`：

- **schema 是唯一手工维护的 wire 契约。** `fixtures/schema/*.schema.json` 喂给 `generate-contracts.ts`，产出 TypeScript 产物（接口 + 运行时校验器）与 pydantic 模型；`--check` 对漂移失败。线上字段名是 snake_case（schema 的拼写），Node provider 因此在同一变更里把 `uptimeSeconds` 迁移为 `uptime_seconds`——接缝规则第一天就作用在了真实代码上。
- **共享 fixtures 双面离线回放**（`ci-contracts`）：一正一反两个 JSON，由各语言的生成校验器验证。证明两个面在 wire 上达成一致，不需要任何活进程。
- **`ci-e2e` 是唯一的活进程泳道**：真实套接字拉起 Python 服务，用 TypeScript 生成校验器验证其 `/health` 载荷——跨栈主张被检查，而非被假设。
- **runner 的 Gate 增加 `cwd`** 而不是把 `--project` 旗标散落在命令里：每条 Python 门禁声明自己的工作目录，泳道定义保持声明式。
- 两套工具链都是一等公民：CI 安装 pnpm 与 uv，跑同一个 `check:all`；没有"主泳道带挂件"。

## Alternatives considered

- **从 pydantic 生成 TypeScript（或反向），而不是中性 schema**。落败原因：一个栈变成事实源、另一个变成消费者——正是路线图拒绝的不对称；JSON Schema 语言中立，且与 fixtures 一起以 git 版本化。
- **用现成生成器（openapi-typescript、datamodel-code-generator）**。推迟：在只有一个 schema 的现在，它们为一个 130 行显式映射器就能做的事引入依赖与配置面；采用时机是第二个 schema 构造族（联合、嵌套对象）出现而手工映射器无法承载之时。
- **保留两个 `/health` 契约、各 kit 一个，容忍命名漂移**。落败原因：漂移正是本 kit 要消灭的 bug 类；`uptimeSeconds` 与 `uptime_seconds` 的分叉会在每个未来载荷里复发。

## Consequences

schema 变更从此按合同跨泳道：再生成、双端回放、更新 provider——`docs/testing.md` 把它命名为唯一必然跨面的变更面。生成器只支持今天 schema 用到的构造并明说；扩展它意味着扩展声明的支持面，而非静默接受。两个单栈 kit 保持独立可采用；本仓库是组合形态，三个 kit 在打 tag 发布时同步。
