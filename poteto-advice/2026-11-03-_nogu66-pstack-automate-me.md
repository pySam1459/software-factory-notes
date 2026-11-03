# @_nogu66 on `/automate-me` (vs `/poteto-mode`)

- Source: https://x.com/_nogu66/status/2117564358335267160 (@_nogu66, Software Engineer / AI Champion). Europe/London: Tue 3 Nov 2026, 10:27 UTC. 0 replies, 73 likes, 75 bookmarks (metrics from fetch).
- Linked: https://github.com/cursor/plugins/tree/main/pstack (pstack plugin, MIT, © 2026 Lauren Tan / @poteto).
- Folder: **poteto-advice/** (pstack skill behaviour and how Sam maps it onto GHCP).
- Checked against public clone of `cursor/plugins` `pstack/skills/automate-me/SKILL.md`, `pstack/skills/poteto-mode/SKILL.md`, and `pstack/docs/guide/09-make-it-yours.md`.

## What the post says

Original:

> pstack は /poteto-mode というベストプラクティス的なスキルに目を奪われがち
> だけど、 /automate-me という自分に最適化されたモードを作れることはもっと評価されるべき

Translation (Chief):

> With pstack, people tend to get drawn to the best-practice skill /poteto-mode, but the fact that you can build /automate-me, a mode optimised for yourself, deserves more credit.

No replies on the post. The claim is taste and product emphasis, not a measured result.

## What `/automate-me` actually does

Real, current skill at [`pstack/skills/automate-me/SKILL.md`](https://github.com/cursor/plugins/blob/main/pstack/skills/automate-me/SKILL.md). User-invoked only (`disable-model-invocation: true`). It orchestrates an inline mining pass, Cursor's built-in `create-skill`, and pstack's **unslop** skill. It does not replace those.

**Inputs**

- Existing personal mode, if any: recursive search under `.cursor/skills/**/*-mode/SKILL.md` and `~/.cursor/skills/*-mode/SKILL.md` matching the user's handle.
- Recent agent transcripts in the **active workspace only** (the workspace `agent-transcripts/` path from the system prompt). Explicit guardrail: do not glob across `~/.cursor/projects/*/`. That would cross workspace boundaries.
- On update runs: only history since the skill's last edit (`git log -1 --format=%cI <path>`).
- Structured answers from the user via `AskQuestion` (preferences mining alone misses).
- It does **not** claim to mine git history, PR review comments, or CI logs. Those belong to `/correct` and `/reflect` elsewhere in the guide.

**Steps (as written)**

0. Check for an existing `*-mode` skill; update by default, start fresh only with confirmation.
1. Mine history with parallel subagents over slices (e.g. last 2 to 4 weeks, three slices). Cross-check: patterns in 2+ slices are high-confidence; lone signals usually drop. Signals: response preferences, delegation, verification posture, code/prose discipline, process conventions, meta skill habits.
2. Ask the user with a few multi-choice questions, then one free-form catch-all.
3. Cluster into sections (response style, autonomy, understand first, subagents, prose/code, review/verify, process, skills). Read **poteto-mode** for shape and granularity; do not copy its content.
4. Draft via `create-skill` to `.cursor/skills/<handle>/<handle>-mode/SKILL.md` (or project/personal defaults). Frontmatter triggers on their name and `/<handle>-mode`, with `disable-model-invocation: true` unless they opt into every-turn.
5. Run **unslop**, show the draft, iterate with the user.
6. Land from a worktree: commit and open a PR. Do not push to main.

**Outputs**

- One personal `-mode` skill file (e.g. `jay-mode`, `priya-mode`), reviewed via PR.
- Evaluation is a vibe-check with the user ("does it read like them?"), not a create-skill benchmark loop, unless trigger accuracy fails in practice.

**Guardrails worth keeping**

- Don't overfit to one conversation; require multiple instances.
- Reference other skills by path; don't paste them.
- Skip empty sections; name conventions as "the user" / "the human", not the author's first name.
- When not to use: task-specific or narrow workflow skills go through `create-skill` alone, not a mode skill.

Guide copy that matches: [`pstack/docs/guide/09-make-it-yours.md`](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/09-make-it-yours.md) ("Generate your own mode with `/automate-me`").

## How it differs from `/poteto-mode`

| | `/poteto-mode` | `/automate-me` |
|---|---|---|
| What it is | Lauren Tan's ready-made working style: principles, autonomy, subagent defaults, playbooks under `pstack/skills/poteto-mode/` | A generator that builds **your** `*-mode` skill from your transcripts and answers |
| Size / role | Large routing skill plus many playbooks and scripts | Short orchestrator (~100 lines) that calls mining + `create-skill` + unslop |
| Content source | Hand-authored poteto conventions | Evidence from the user's own sessions, then human-edited |
| Relationship | The shape `/automate-me` tells you to imitate without copying | Keeps pstack underneath; your mode sits **alongside** poteto-mode (README line) |

@_nogu66 is right that `/poteto-mode` is the shiny best-practice surface and `/automate-me` is the personalisation path. Both are first-class in the plugin README skill table.

## What checks out

- Skill exists, is listed in the pstack README, and matches the guide's "Make it yours" page.
- Mining is workspace-scoped transcripts, not inventing git/PR mining.
- Output is a reviewed PR for a personal mode skill, not a silent write to main.
- Unverified from this post alone: whether @_nogu66 ran `/automate-me` successfully, or how good the resulting mode is on their tasks.

## GHCP mapping for Sam's factory

Sam does not run Cursor pstack on the Microsoft stack. Build the same *job* with GHCP primitives:

1. **Custom agent or skill** (e.g. `/sam-mode-bootstrap` or a one-shot Agentic Workflow) that reads Sam's own past Copilot coding-agent session logs / transcripts where available, plus recurring PR review comments he leaves, and proposes a personal `.github/agents/sam-mode.md` (or a personal skills pack / `.github/instructions/` layer), not a copy of poteto-mode.
2. **Human gate:** changes land only as a reviewed PR, same as automate-me's worktree + PR rule. No silent edit of standing instructions.
3. **Evidence bar:** require a preference in 2+ sessions before codifying (automate-me's cross-slice rule). Prefer path references to existing verification skills over pasting poteto prose.
4. **Measure after merge:** re-run a fixed set of past tasks before keeping the new mode rules, and prune ones that never fire or do not change behaviour. That is the lesson from the Treude/Baltes `/retro` study: [../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md). Automate-me's own eval is a vibe-check; Sam should add the held-out / ablate loop for anything that becomes standing factory policy.
5. **Split concerns:** use this personal-mode generator for *how Sam likes agents to work*; keep `/correct`-style repo hard constraints (lint, types, CI) for *what the codebase forbids*. Do not stuff both into one instructions file.

**[Chief]:** treat `/poteto-mode` as the reference shape and bar, and `/automate-me` as the template for a GHCP "mine my sessions, draft my mode, open a PR, then eval" skill. Do not ship a hand-copied poteto-mode into Copilot instructions and call it personalisation.
