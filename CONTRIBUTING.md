# 贡献 / Contributing

## 中文

欢迎具体的安装问题、失败案例和小范围修复。Issue 请写明使用工具、请求、预期结果、实际结果及复现步骤；示例中不要包含凭据或个人数据。

修改提示词时说明希望改变的行为和可能的副作用。修改工具库时运行以下检查，为行为变化补对应回归测试：

```bash
npm ci --prefix core/tools --ignore-scripts
npm run build
npm test
```

文档改动请同步中文与英文入口。模型示例要注明是示意、实测还是尚未验证，不编造测试数或效果指标。

## English

Specific installation problems, failure cases, and focused fixes are welcome. Include your coding tool, request, expected and observed behavior, and reproduction steps. Leave credentials and personal data out of examples.

For prompt changes, describe the intended behavior and possible side effects. For toolkit changes, run the commands above and add regression coverage for changed behavior.

Keep Chinese and English entry-point documentation aligned. Label model examples as illustrative, observed, or unverified; do not invent test counts or effectiveness metrics.
