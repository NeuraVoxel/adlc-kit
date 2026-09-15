# 测试策略

中文 | [English](testing.md)

证据匹配变更面：跑能证明本次变更回归的最窄检查；不默认全量；不重复已通过的检查。CI 拥有穷举矩阵。

## 变更面 → 证据

| 变更面 | 证据 |
|---|---|
| `server/src/**` | vitest 的 `node` project（`server/tests/`）；Fastify `inject()`，无网络 |
| `apps/web/src/**` | vitest 的 `web` project（jsdom + Testing Library） |
| `packages/contracts/src/**` | 消费它的双端测试 + `pnpm run typecheck` |
| `scripts/**` | `scripts/run-gates.spec.ts` 与 `scripts/verify-doc-pairing.spec.ts` + `pnpm run check:all` |
| `packages/create-adlc-kit-ts/**` | `tests/lib.spec.ts` + 真实脚手架/采纳冒烟（见下） |
| `.agents/{inbox,learning,skills}/**`、`ChangeLog.md`、`docs/release.md` | `pnpm run doc-sync`（配对合同）+ 评审；spark、排队行与学习笔记是不设门禁的用户内容 |
| `docs/**`、`README*` | `pnpm run doc-sync`（双语文档配对） |

## 聚焦运行

```sh
pnpm exec vitest run server/tests/app.spec.ts
pnpm exec vitest run --project web
pnpm run doc-sync
```

安装器变更需要真实冒烟：脚手架到临时目录并在其中跑门禁——拷贝出的 checkout 就是产品。

## 演进顺序

覆盖率门禁暂未启用；先引入全局阈值，风险集中后再 per-file 收紧。快照泳道与真实 e2e 泳道（`ci-e2e`）在第三步引入，无凭据自跳过；在此之前，`web` project 的组件测试守护用户可见输出。测试描述行为而非实现：重构不动测试，行为变更连同测试一起改。
