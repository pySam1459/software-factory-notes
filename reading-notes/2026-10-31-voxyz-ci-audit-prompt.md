# @Voxyz_ai CI audit prompt: Boardy numbers, no credit

- Source (Sam): https://x.com/Voxyz_ai/status/2116636332344889391 (@Voxyz_ai / Vox). Europe/London: Sat 31 Oct 2026, 21:00 UTC. Image: before/after CI table. Pasteable "Audit this repo's CI" prompt for Claude Code or Codex.
- Image saved: `reading-notes/voxyz-ci-audit-prompt.png` (table: CI per PR 40 min to 2 min; machine wait 11 min to 8 s; lint 2 min to 5 s; typecheck 70 s to under 5 s; test shard 100 s to 35 s; checkout 36 s to 12 s; install deps 33 s to 13 s).
- No quoted post; no link to the original article. Replies are mostly engagement echo; none from Vox naming a source.
- Primary origin (already noted): @owengretzinger X Article "How I made our CI 20x faster (steal this)" https://x.com/owengretzinger/status/2116291924219060319 (Boardy). Full claims check in `2026-10-31-owengretzinger-ci-20x.md`.
- Folder: **reading-notes/** (CI / Actions playbook remix; not ux, poteto-advice, or formal-verification).

## Verdict (lead)

**Useful prompt; dishonest packaging.** The 40 min to 2 min story, the 150-run queue/setup/run split, the year-old dependency-cache miss on half the test jobs, and the nine checklist items are lifted from @owengretzinger's Boardy write-up. @Voxyz_ai never names Boardy, Blacksmith, Oxlint, bun check, Vitest, or Nx, and never links the article. Steal the **audit prompt** (report first, change nothing) and treat the big numbers as **Boardy's author-reported result**, not as Vox's measured win. For the full playbook and cost line ($230/mo to $4,300/mo), use the Owen note, not this post.

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| "Nine changes" cut CI from up to 40 min to 2 | **Boardy's numbers, unattributed.** Same headline as Owen's article. Not independently audited; not Vox's repo. | Owen article table; existing note |
| Agent pulled last 150 CI runs; split wait / setup / run; half of test jobs missed dependency cache for a year | **Same anecdote as Boardy §6.** Real Actions footgun (PR-scoped caches with no seed from `main`). "Year" and "half" are author audit claims. | Owen article; GH Actions cache scoping |
| Image timings (machine wait 11 min to 8 s, lint 2 min to 5 s, typecheck 70 s to under 5 s, shard 100 s to 35 s, checkout 36 to 12, install 33 to 13) | **Match Owen's article row-for-row.** | Owen article + Vox image |
| Prompt's nine checks map to real CI levers | **Yes, and they match Owen's nine sections** (runners, lint, typecheck, sharding/size, isolate/reload, setup/cache/blobless/cores, parallel jobs, affected-only, pre-push). Direction supported by Linear's CI write-up and product docs; see Owen note for primary links. | Prompt text vs Owen §§1 to 9 |
| Implies Vox (or "you") achieved 40 to 2 | **Misleading by omission.** First person absent, but no credit either. Engagement replies treat it as Vox's result. | Post body; thread |
| Cost of the win | **Missing here.** Owen reports CI bill $230/mo to $4,300/mo. | Owen "What it costs" |

## What to steal vs skip

**Steal**
- The pasteable audit prompt: `gh` last 150 runs; split queue vs setup vs run; check the nine items; for each problem give seconds cost, file:line, rough save; separate money/risk changes; **report first, change nothing**.
- Habit: measure before patching workflow YAML (reply from @anonvibecoder asked whether agents edit YAML after; good human gate).

**Skip / caveats**
- Do not cite "Vox cut CI 20x". Cite Boardy / @owengretzinger, or measure your own Actions wall-clock.
- Do not apply `isolate: false`, smaller suites, or paid runners from the prompt alone; Owen note covers flake and bill risk.
- cancel-in-progress on branch concurrency (@mehdidotnet reply) is a separate, sound tip when agents push every few minutes; not in Vox's prompt.

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills / instructions** | Add a `ci-audit` skill that embeds this prompt (or Owen's fuller checklist), requires a written report artifact, and forbids workflow edits until a human says go. |
| **Coding agent / cloud agent** | Safe first job: run the audit with `gh`, open a draft issue or PR comment with the report. Second job only after approval: patch Actions YAML, cache keys from `main`, pre-push hook. |
| **Actions** | Highest leverage once measured: runner choice, cache seed, parallel jobs, affected filters, required checks that fail on bad skips. Track p50/p95 wall-clock and $/mo as eval metrics. |
| **Agentic Workflows** | Optional scheduled workflow: weekly CI time report from last N runs (same three-way split). |
| **Custom agents** | Optional "CI product owner" agent whose only job is audit reports and proposed diffs, never silent merges. |
| **Memory** | Store baseline timings and the factory's chosen runner/lint/typecheck stack so agents do not rediscover the same footguns. |
| **pstack** | Matches verify-before-change: report first. Speeds the trust gate; does not replace review or merge policy (Owen's next bottleneck was human merge). |

## Takeaway

A copy-paste CI audit prompt wrapped around someone else's before/after table. For Sam's factory: keep the prompt as a skill, keep attribution and the cost warning from the Owen/Boardy note, measure your own Actions before buying faster runners.
