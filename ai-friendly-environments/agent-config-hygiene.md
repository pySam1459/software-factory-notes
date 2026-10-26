# Agent config hygiene

Instructions, skills and MCP servers are prose and context. They sit at the second-lowest level of the pyramid. More of them doesn't make an agent better. It costs tokens, and the files contradict each other and go stale.

## What poteto says

- "i'm a big advocate of moving prose into deterministic code: lint rules, strong types, good API design are superior to comments, agents.md, rules, skills" ([14 Oct](https://x.com/poteto/status/2110498629307990461)).
- Her pstack principles are "very concise skills (~10-20 loc)", and "as models get smarter, i expect most of pstack skills to compress into short principles or workflows … and that i will be able to delete a few of them" ([14 Oct](https://x.com/poteto/status/2110496830429839869)).
- 24 Oct: "i am constantly updating and simplifying pstack. the more capable models get, the less instructions they need. over time i expect the skills to shrink more and more, until they're basically just saved prompts" ([post](https://x.com/poteto/status/2114099131845423142)).
- Skills are "at the very least … just saved prompts that capture some workflow you want to repeat later. for my own skills in pstack I also do run evals on them" ([13 Oct](https://x.com/poteto/status/2109912648116826250)).
- All pstack skills "have disable-model-invocation: true so they don't get auto injected into every session, so there's no token cost to installing it" ([15 Oct](https://x.com/poteto/status/2110760668987322408)).
- `/setup-pstack` asks you to "choose your budget". She also says not to use `/poteto-mode` for everything: "just your hardest tasks that need the most rigor" ([15 Oct](https://x.com/poteto/status/2110534523389943974)).

### Evals

From the live session:

- she treats an eval as "like a unit test for an agent"
- a coordinator agent writes a rubric and spawns sub-agents in neutrally named directories ("agents can actually tell and when they do, they change their behavior")
- a judge on a different model cross-checks the scores
- she loops "until everything is 10 out of 10"
- she runs this every time she modifies a skill

## Rules **[Chief]**

1. **One skill per job.** If two skills could both answer the same request, the agent picks one at random, or loads both. Merge them, or delete one.
2. **Short.** Aim for 10–20 lines, like pstack's principles. Anything longer is usually a workflow that should be a script ("Build the Lever": "If a script can do a step the same way every time, use the script, and save agents for the judgment calls").
3. **Opt-in by default.** Prefer skills you invoke by name for heavy workflows (`/correct`, a review checklist). Only short, always-relevant rules should be auto-loaded.
4. **Every rule has an enforcer, or a reason it can't have one.** Use the rule table in [principles.md](principles.md). Delete prose once a lint rule covers it. `/correct` does this: "Drop a rule once its mistake can't happen."
5. **Test a skill before you trust it.** It doesn't need poteto's full eval harness. Run the skill on 3–5 real past tasks, with and without it, and compare. Rerun when you change it.

## Layering for Copilot

| Layer | Where | What goes there |
|---|---|---|
| Repo-wide | `.github/copilot-instructions.md`, `AGENTS.md` | Owned by the repo's maintainers, not you. Usually already exists in a big repo. Don't add to it for your folder's concerns. |
| Folder | `.github/instructions/<area>.instructions.md` with `applyTo: "src/features/my-area/**"` | Your rule table and the few judgement calls. Loaded only when the agent works on matching files. |
| Skills | `.github/skills/<name>/SKILL.md` (repo) | Team workflows: `/correct`, verification. Each one has a `description` saying exactly when to use it. |
| Personal | `~/.copilot/skills/`, `~/.copilot/hooks/`, VS Code user prompt files | Your own habits (e.g. a "catch me up" prompt). Never put team rules here: nobody else's agent sees them. |
| MCP servers | `.vscode/mcp.json` (repo) or the user config | Only the servers a task actually needs. Each server adds tool descriptions to every request. |

The exact paths and supported frontmatter differ between VS Code, the Copilot CLI and the cloud agent, and they change often. Check the current docs for the surface you use before relying on a field such as `applyTo` or an invocation flag.

## Audit what's loaded **[Chief]**

Once a month:

1. **List everything that can load for your folder.**
   - instruction files whose `applyTo` matches
   - `AGENTS.md` files up the tree
   - repo and personal skills
   - enabled MCP servers and their tool counts

   In VS Code, a chat response's references list shows which instruction files were attached. The Copilot CLI has slash commands for listing skills and MCP servers (see `/help`).
2. **Look for overlap.** Two files saying the same thing, or worse, contradicting each other.
3. **Look for rules a check now enforces.** Delete the prose.
4. **Look for skills nobody invoked in the last month.** Delete them, or turn them into a personal skill.
5. **Count the tokens.** Paste the always-loaded files into a tokenizer. If the always-on context is more than a page or two, cut it.

## Example: three overlapping browser skills **[Chief]**

This example came up in an earlier conversation with Sam: three browser tools installed side by side, each with its own skill:

- **Playwriter.** A Chrome extension plus MCP/CLI that lets agents drive *your* logged-in Chrome. In the post Sam bookmarked, its author describes it as "the easiest way to control your Chrome browser with agents" ([@__morse](https://x.com/__morse/status/2112954960627536111)).
- **Chrome DevTools MCP** (`chrome-devtools-mcp`, from the Chrome DevTools team). It drives Chrome through the DevTools protocol: performance traces, network, console, screenshots. poteto's first verification skill at Cursor, "control glass", was built on the Chrome DevTools protocol, to run the app and take performance traces.
- **Playwright** (the test runner, and `@playwright/mcp`). Clean, scriptable browser contexts, accessibility-tree snapshots, and the same code works in CI.

All three can "open the app and click around", so the agent picks one at random, mixes them within a task, or loads all three tool lists. Give each one a single job:

| Job | Tool | Why |
|---|---|---|
| Verification that must repeat in CI (does the feature work?) | **Playwright** test or script | Deterministic, runs headless in Azure Pipelines, same command locally and in CI |
| Performance and debugging (traces, long tasks, network waterfalls, console errors) | **Chrome DevTools MCP** | That's what the DevTools protocol is for. This is what poteto's control skill did. |
| Tasks that need your signed-in browser session (internal tools behind SSO) | **Playwriter**, if allowed | It reuses your logged-in Chrome, which is also why it needs the most care. Check company policy before using it on corporate accounts. |

Then:

- Keep one verification skill that says which tool to use for which job, with a CLI checked into the skill directory. poteto: "rather than have your agents create scripts every time … you can actually create a CLI that's within the skill directory".
- Add a feature map: poteto's "form of materialized memory" describing what features exist and how a user reaches them (keyboard shortcuts, which elements to click). Keep it next to the CLI.
- Disable the MCP servers that a task doesn't use.
