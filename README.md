# model-safety · REDLINE 红线

模型安全评估概念站：论证「AI 模型能力 → 系统不安全 → 我们的评估能力」三段式叙事，零依赖静态单页。

## 定位

对外展示用的概念站（pitch site），回答三个问题：

1. **01 模型的能力**：AI 已能自主找零日、拿 DARPA 冠军、一天调教机器人——攻击能力是现实而非科幻。
2. **02 系统的裂缝**：提示注入、MCP 投毒、记忆污染、数据外带等六类攻击面，每类附公开来源。
3. **03 评估的能力**：REDLINE 评估矩阵、四步方法论、样例评分卡报告、合规锚点（EU AI Act / ISO 42001 / NIST AI RMF / OWASP LLM Top 10）。

## 运行

```bash
pnpm dev    # http://127.0.0.1:3030（--watch 热重启）
pnpm start  # 生产模式
```

## 结构

- `public/index.html` — 全部页面（内联 CSS/JS，无构建、无外部依赖）
- `server.mjs` — 仅 Node 内置模块的静态文件服务

## 页面内交互

- Hero 攻击日志流（`prefers-reduced-motion` 时静态展示）
- 「60 秒注入演示」：模拟工单隐藏字段注入，对比无防护 / 加固两个 agent 的执行日志
- 评分卡：滚动到视口时数字与进度条动画

## 安全与合规说明

- 所有演示均为本页 JS 脚本模拟，不含可用攻击载荷；示例域名已无害化（`attacker-example.com`）。
- 引用事实均来自页面底部「公开来源」列表（Project Zero、DARPA、Anthropic、Straiker、Pomerium、CSA、OpenReview 等），发布前已逐条核实。
- 联系邮箱为占位符（`hi@example.com`），上线前替换。

## 部署

GitHub Pages（Actions 工作流部署 `public/`）：推送 `main` 分支自动发布。

## 待办

- [ ] 真实联系方式与品牌定名确认（当前用 REDLINE 红线）
- [ ] 可选：接 OpenAI 兼容代理让演示跑真模型（当前为纯脚本模拟）
