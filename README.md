# Buguidaqiang · 不鬼打墙

**给 AI 编程加上范围、恢复点与验证记录。**

[English](README.en.md) · [快速开始](pure-prompts/QUICKSTART.md) · [示例](pure-prompts/examples/sample-sessions.md) · [版本记录](CHANGELOG.md)

当“改个小功能”逐渐变成修改更多文件、引入更多问题，用户需要看清三件事：**准备改什么、怎样恢复、用什么证明完成。** Buguidaqiang 把这些问题整理为八个提示词技能，并提供实验性的 TypeScript 工具。

**状态：Experimental · v0.1.1。** 提示词是对助手的流程指导，效果取决于模型和运行工具；它不是权限隔离、自动备份服务，也不保证消除错误。现有技能正文以中文编写。

## 两个入口

| 入口 | 用途 | 结果 |
| --- | --- | --- |
| `/assess 你的需求` | 先理解影响 | 需求、涉及文件、风险和建议；不修改文件 |
| `/safe 你的需求` | 执行明确的变更 | 说明范围、准备恢复点、实施、报告实际验证结果 |

```text
明确需求 → 界定范围 → 准备恢复点 → 修改 → 验证与交付
```

## 安装到一个项目

需要 Git 和 POSIX shell（macOS / Linux）。提示词本身不需要 Node.js。

```bash
git clone https://github.com/Parkering-Tang/BuGuiDaQiang.skills.git
cd BuGuiDaQiang.skills
sh scripts/install-skills.sh /absolute/path/to/your-project/.claude/skills
```

把最后一行换成你要使用技能的项目路径。安装器会复制完整的八个技能目录；只要目标中已有任意同名技能，就在复制前停止，不覆盖现有文件。使用新会话打开目标项目，先尝试 `/assess`。

Claude Code 的目录格式是 `<技能名>/SKILL.md`，不是平铺的 `safe.md`。[官方文档](https://code.claude.com/docs/en/skills)。其他工具可读取 [safe/SKILL.md](pure-prompts/skills/safe/SKILL.md) 作为自定义指令参考；这里不承诺其他工具的命令注册兼容性。

### 更新与移除

升级前对比并备份已有技能，再在明确的目标目录中更新。安装器不自动覆盖升级。移除时仅删除由本项目安装且未被你替换的八个目录。

## 一个具体例子

请求：“状态显示改成中文。”先确认用户要改的是**界面文案**还是**存储状态**。若只是显示文案，保留 `pending` / `done` 等内部值，在显示层映射为“待处理”/“已完成”，检查未知值的回退行为。

使用虚构数据的确定性演示（需要 Node.js）：

```bash
node examples/status-labels/demo.cjs
```

它展示显示映射和内部值不变的检查，不调用模型，也不代表一次真实 Claude Code 会话。[演练步骤与验收边界](pure-prompts/examples/sample-sessions.md)。

## 验证工具库

工具库供开发者实验使用；它尚未自动接入提示词技能，快照工具也不是完整备份系统。

```bash
npm ci --prefix core/tools --ignore-scripts
npm run build
npm test
```

开发检查以 Node.js 24 为基线。测试覆盖安装器的完整复制与同名冲突，以及验证执行器的空配置、成功和失败路径；不是整个项目或模型行为的完整覆盖。[本次验证范围](docs/validation-2026-09-14.md)。

## 当前边界

- 提示词可能被忽略，无法强制隔离权限；需遵循所用工具的权限机制。
- 记录 Git commit 不会保存未提交和未跟踪文件，恢复前要核对实际工作区状态。
- 工具库快照面向受信任的本地文本文件；尚未完整处理路径约束、二进制文件和快照冲突，不建议用于重要数据的自动恢复。
- 验证执行器会运行项目配置中的命令，只应对受信任的项目使用；没有检查命令时返回“未验证”。
- 未提供跨模型成功率评测；示例结果不代表模型可靠性承诺。

## 接下来

- 增加可重复的模型行为评测，记录误报、漏报与操作成本。
- 改善恢复策略，覆盖未提交文件和失败恢复。
- 根据使用反馈决定是否把工具库接入技能流程。

## 反馈与贡献

欢迎通过 [Issue](https://github.com/Parkering-Tang/BuGuiDaQiang.skills/issues) 提交具体请求、使用工具、预期和实际行为。提交代码前请阅读 [贡献说明](CONTRIBUTING.md)。

[MIT License](LICENSE) · [Parker Tang](https://github.com/Parkering-Tang)
