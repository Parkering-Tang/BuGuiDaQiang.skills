# Buguidaqiang

**Make scope, recovery points, and verification visible in AI-assisted coding.**

[中文](README.md) · [Example](pure-prompts/examples/sample-sessions.md#english) · [Changelog](CHANGELOG.md)

A small feature request can turn into an expanding set of changes. Buguidaqiang organizes eight prompt-based skills around three questions: **What will change? How can it be recovered? What evidence shows it works?** An experimental TypeScript toolkit accompanies the prompts.

**Status: Experimental · v0.1.1.** Prompts guide an assistant; their effect depends on its model and tools. This project is not a permission sandbox, automatic backup service, or guarantee against mistakes. The existing skill bodies are written in Chinese.

## Two entry points

| Command | Purpose | Output |
| --- | --- | --- |
| `/assess your request` | Understand the impact first | Scope, affected files, risks, and options; no file edits |
| `/safe your request` | Carry out a defined change | Scope, recovery preparation, implementation, and actual verification results |

```text
Clarify → Bound the scope → Prepare recovery → Implement → Verify and report
```

## Install into one project

Git and a POSIX shell (macOS / Linux) are required. The prompts do not require Node.js.

```bash
git clone https://github.com/Parkering-Tang/BuGuiDaQiang.skills.git
cd BuGuiDaQiang.skills
sh scripts/install-skills.sh /absolute/path/to/your-project/.claude/skills
```

Replace the destination with your project path. The installer copies all eight complete skill directories. It checks every destination name first and stops before copying if any name already exists. Open a new Claude Code session in the target project and start with `/assess`.

Claude Code uses `<skill-name>/SKILL.md`, not a flat `safe.md` file. See its [official documentation](https://code.claude.com/docs/en/skills). Other tools can use [safe/SKILL.md](pure-prompts/skills/safe/SKILL.md) as a custom-instruction reference; command registration in those tools is not verified here.

### Update or remove

Review and back up existing skills before updating them in the chosen destination. The installer does not overwrite an existing installation. To remove it, delete only the eight directories installed by this project that you have not replaced with your own skills.

## A concrete example

Request: “Show the status in Chinese.” First determine whether this means display labels or stored states. For a display-only change, retain `pending` / `done` internally, map them to translated labels, and check the fallback for unknown values.

Run a deterministic demonstration with fictional data (requires Node.js):

```bash
node examples/status-labels/demo.cjs
```

It checks display mapping and unchanged internal values. It does not invoke a model or record a live Claude Code session. See the [walkthrough](pure-prompts/examples/sample-sessions.md#english).

## Validate the toolkit

The toolkit is for developer experiments. It is not automatically connected to the prompt skills, and its snapshot utility is not a complete backup system.

```bash
npm ci --prefix core/tools --ignore-scripts
npm run build
npm test
```

Node.js 24 is the development baseline. Tests cover installer copying and collisions, plus missing, successful, and failing verification commands. They are not full coverage of the project or model behavior. See the [validation scope](docs/validation-2026-09-14.md#english).

## Current limitations

- Prompts can be ignored and do not enforce permissions. Use your coding tool's permission controls.
- A Git commit reference does not preserve uncommitted or untracked files. Review the worktree before recovery.
- Snapshots target trusted local text files. Path boundaries, binary files, and snapshot collisions are not fully handled; do not use this utility for automatic recovery of important data.
- The verifier runs commands declared by the project. Use it only on trusted projects. No configured checks means **unverified**, not passed.
- There is no cross-model success-rate evaluation. Demonstrations are not reliability guarantees.

## Next steps

- Add repeatable model-behavior evaluations covering missed risks, false alarms, and interaction cost.
- Improve recovery for uncommitted files and unsuccessful restores.
- Use feedback to decide whether the toolkit should be integrated with the skills.

## Contribute

Open an [issue](https://github.com/Parkering-Tang/BuGuiDaQiang.skills/issues) with the request, tool used, expected behavior, and observed result. See [contributing](CONTRIBUTING.md#english) before sending code.

[MIT License](LICENSE) · [Parker Tang](https://github.com/Parkering-Tang)
