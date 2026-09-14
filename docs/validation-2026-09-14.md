# 验证记录 · 2026-09-14

[English](#english) · [主页](../README.md)

## 本地环境与结果

环境：macOS、Node.js 24.19.0、npm 11.17.0。

| 检查 | 结果 | 范围 |
| --- | --- | --- |
| 工具库 TypeScript 编译 | 通过 | `npm run build` |
| 安装器测试 | 4 通过 | 完整目录、含空格路径、已有技能、悬空链接、缺少参数 |
| 验证执行器测试 | 5 通过 | 空配置、命令成功、构建失败、测试失败、脚本缺失 |
| 确定性示例 | 通过 | 显示映射、未知值回退、原始数据不变 |
| 开发依赖审计 | 更新后报告 0 项已知漏洞 | 当次 npm audit 结果，不是永久安全保证 |

## 修复前后

修改前的编译产物在没有检查命令时实际返回：

```json
{"passed":true,"results":[],"summary":"验证通过：0 项"}
```

现在返回 `passed: false` 和 `status: skipped`，说明未配置检查。原版本 `npm test` 没有找到测试；新增的九个测试只覆盖上表列出的行为。

## 重现

```bash
npm ci --prefix core/tools --ignore-scripts
npm run build
npm test
node examples/status-labels/demo.cjs
```

安装测试只写临时目录，没有安装到维护者真实的个人技能目录。没有执行真人用户试验、模型可靠性对比、Windows 安装测试或完整恢复测试。CI 结果以 [Actions](https://github.com/Parkering-Tang/BuGuiDaQiang.skills/actions) 的具体运行记录为准。

## English

Local environment: macOS, Node.js 24.19.0, npm 11.17.0.

- TypeScript compilation passed.
- Four installer tests passed: complete copying, a path containing spaces, existing skill names, dangling-link collisions, and missing arguments. Some checks share one test scenario.
- Five runner tests passed: no configured commands, successful commands, a failed build, a failed test, and a missing script.
- The deterministic example passed its label mapping, unknown-value fallback, and unchanged-data checks.
- After compatible lockfile updates, npm audit reported zero known vulnerabilities at this run; this is not a permanent security guarantee.

The pre-change build actually returned the JSON above for a project with no checks. The fix reports `passed: false` with `status: skipped`. The original test command found no tests; the nine new tests cover only the behaviors listed here.

Use the commands above to reproduce. Installer tests write only temporary directories; they do not install into the maintainer's personal skill directories. This run includes no real-user trial, model-reliability comparison, Windows installer test, or complete recovery test. Remote CI status should be read from the corresponding [Actions run](https://github.com/Parkering-Tang/BuGuiDaQiang.skills/actions).
