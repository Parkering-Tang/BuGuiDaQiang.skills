# Changelog / 版本记录

## 0.1.1 — 2026-09-15

### 中文

- 重写中英文 README，统一真实技能目录路径，补齐 MIT 许可证与贡献入口。
- 增加显式目标目录安装器：安装前检查全部同名技能，避免覆盖；增加四个安装测试。
- 修复验证执行器在没有配置命令时返回“通过”的问题，改为“未验证”；增加五个回归测试。
- 增加使用虚构数据的确定性显示映射示例，替换容易与真实测试混淆的示意会话。
- 更新开发依赖锁文件中的兼容版本，增加构建和测试 CI。
- 保留 Experimental 状态；本版本未提供跨模型效果保证或完整快照恢复能力。

### English

- Reworked Chinese and English READMEs, corrected skill paths, and added the MIT license and contribution guide.
- Added an installer with an explicit destination and a full collision preflight; added four installer tests.
- Fixed empty verification incorrectly passing; it now reports unverified. Added five runner regression tests.
- Added a deterministic label-mapping example using fictional data; replaced illustrative sessions that could be mistaken for observed test results.
- Refreshed compatible development-dependency lockfile versions and added build/test CI.
- Remains Experimental. This release provides neither cross-model reliability guarantees nor complete snapshot recovery.

## Earlier work / 早期开发

The repository began in April 2026. Earlier changes are available in [commit history](https://github.com/Parkering-Tang/BuGuiDaQiang.skills/commits/main).

仓库于 2026 年 4 月开始开发；此前变更见提交历史，本记录不补写不存在的历史发布。
