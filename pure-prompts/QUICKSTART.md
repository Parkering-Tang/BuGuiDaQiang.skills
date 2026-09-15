# 快速开始 / Quick start

## 中文

在仓库根目录执行，替换目标路径：

```bash
sh scripts/install-skills.sh /absolute/path/to/your-project/.claude/skills
```

如果存在同名技能，安装器会停止。先对比已有内容，不要直接覆盖。技能入口实际位于 `pure-prompts/skills/safe/SKILL.md`。

在目标项目中新开 Claude Code 会话，先提出一个只评估的请求：

```text
/assess 我想把状态显示改成中文，只改变界面文案，不改变存储值。
```

检查回复是否区分显示值与内部值，是否列出实际涉及的文件，是否保持不修改文件。再用 `/safe` 提出范围明确的修改请求。实际效果取决于模型与运行工具；加载提示词不等于保证安全。

[完整说明](../README.md) · [演示](examples/sample-sessions.md)

## English

From the repository root, replace the destination path:

```bash
sh scripts/install-skills.sh /absolute/path/to/your-project/.claude/skills
```

The installer stops if any skill name already exists. Compare existing content before updating. The entry point is `pure-prompts/skills/safe/SKILL.md`.

Start a new Claude Code session in the target project and try an assessment:

```text
/assess Translate the status labels into Chinese. Change display text only; keep stored values unchanged.
```

Check that the response distinguishes labels from internal values, identifies relevant files, and makes no edits. Then use `/safe` for a clearly scoped change. Model and tool behavior still determine the outcome; loading a prompt is not a safety guarantee.

[Full guide](../README.en.md) · [Demonstration](examples/sample-sessions.md#english)
