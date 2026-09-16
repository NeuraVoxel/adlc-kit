# 测试策略

中文 | [English](testing.md)

证据匹配变更面：跑能证明本次变更回归的最窄检查；不默认全量；不重复已通过的检查。CI 拥有穷举矩阵。

## 变更面 → 证据

| 变更面 | 证据 |
|---|---|
| `server/src/**` | `server/tests/` 经 Fastify `inject()`；wire 断言走生成的校验器 |
| `apps/web/src/**` | vitest 的 `web` project（jsdom + Testing Library） |
| `python/src/**` | `python/tests/` 经 ASGI 传输（FastAPI `TestClient`，不开活套接字） |
| `fixtures/schema/**` | `pnpm run gen:contracts` + **双端** fixture 回放（`ci-contracts`）+ 每个消费面的测试 |
| `packages/contracts/**`、`python/src/adlc_kit/generated/**` | 永不手改；`ci-contracts` 新鲜度门禁拥有它们 |
| `scripts/**` | 各门禁旁的 spec + `pnpm run check:all` |
| `docs/**`、`README*`、`.agents/**` 合同 | `doc-sync` |

## 泳道映射

```sh
pnpm run check:ci          # TypeScript 各面
pnpm run check:python      # Python 面
pnpm run check:contracts   # 新鲜度 + 双端回放
pnpm run check:e2e         # 活进程跨栈检查
pnpm run doc-sync          # 文档 + notes 门禁
```

schema 变更是唯一必然跨泳道的变更面：再生成、双端回放、跑各 provider 面的测试，然后才能汇报。

## 演进顺序

覆盖率门禁暂未启用；先按面引入全局阈值，风险集中后再收紧。用户可见输出的快照泳道按需引入，无凭据自跳过。测试描述行为而非实现：重构不动测试，行为变更连同测试一起改。
