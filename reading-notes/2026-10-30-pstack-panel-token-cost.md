# pstack panel (and tstack council): multi-agent compare burns tokens

- Source: https://x.com/cu30rry_/status/2116156666643145042 (30 Oct 2026, 13:14 UTC / 13:14 Europe/London, @cu30rry_ / kaito). Japanese post. No media, no video. Quotes https://x.com/Fumiya_Kume/status/2116044240203735138 ("pstackはハイパワーだけど、Token消費もハイパワー").
- Sam's framing (same day): "Panel is good terminology. I've heard theo from tstack refer to [it] as council as well." Treat **panel** (this post / pstack) and **council** (Theo, tstack) as names for the same multi-model fan-out pattern below. Do not put words in Theo's mouth beyond what the published skill says.
- Council skill (read): https://github.com/t3dotgg/tstack/blob/main/skills/council/SKILL.md — earlier full tstack note: `/workspace/notes-out/2026-10-26-theo-tstack-skills.md`.
- Panel mechanics in upstream pstack (read, not invented from the truncated X list): https://github.com/cursor/plugins/blob/main/pstack/docs/guide/01-setup.md ("Keep the cost in check"); panel roles configured by https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md; concrete fan-out in https://github.com/cursor/plugins/blob/main/pstack/skills/arena/SKILL.md and https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md.
- Sibling notes: Ben Holmes shared-judge pitfall — `2026-10-30-bholmes-factory-two-loops.md`; Ondrej separate read-only review — `2026-10-29-ondrej-build-review-ship.md`.
- Sam's project is on GitHub now: map to GHCP only (no ADO).

## What the X post says
Translation of the readable body (API returned no `note_tweet`; this is the full text the tools gave):

- pstack tokens are spent mainly on **subagents** and **panels**.
- A **panel** is a mechanism that has several agents solve the **same** problem and compare them; that is where a lot of tokens go.
- pstack also has ways to save tokens; "about four". The only method named in the returned text is **`/setup-pstack`**. The other three bullets are not present in the fetched post, so they are not attributed to kaito here.

Quoted post is only the high-power / high-token quip; no further detail.

Replies (not author claims): `/how` can run ~$10 a go (@macson_g); Codex port keeps `$poteto-mode` explicit so idle turns do not load it; `/setup-pstack` can honour "no models dumber/more expensive than …" (@BlackWolfNews).

## Panel in pstack (from upstream docs)
Guide line: "pstack spends extra tokens on subagents and review panels. That's the price of the rigor."

**Panel roles** (setup-pstack): values are **lists**; one subagent per entry, so list length is panel size. Named panel-ish roles include `arena runners`, `architect runners`, `interrogate reviewers`, plus `arena cross-judge pool` (Arena picks **one** judge from another model family, not one judge per pool entry).

Four spend-less steps in the official guide (these match the "about four" shape; cite the guide, not the incomplete X list):

1. Rerun `/setup-pstack` with a smaller reasoning budget or cheaper models (strong parent + cheaper code roles is a suggested split).
2. Set a role to `auto` / `inherit-parent` so it uses the parent chat model.
3. Shorten a panel list (each entry = one subagent).
4. Save `/poteto-mode` for work that needs rigor; skip it for small obvious edits.

**`/arena`**: N parallel candidates, same framed task → cross-judge (other family) → pick a base → graft → verify. Default runners: Opus + Grok.

**`/interrogate`**: arena-style fan-out of adversaries; findings survive only if a **run** proves them; no auto-fix. Read-only report.

## Council in tstack (Theo)
Skill trigger: user says "council". File: https://github.com/t3dotgg/tstack/blob/main/skills/council/SKILL.md.

- Three delegates, one strong model per **different provider** (defaults named in the skill: Claude Opus, GPT Sol, Gemini Pro; override via user instructions / CLAUDE.md or AGENTS.md).
- T3 Code: `orchestrator_capabilities` then parallel `delegate_task`; else harness subagents. If three providers are unreachable, **report — do not substitute**.
- For review/feedback: keep delegates **read-only**; score out of 10; loop (fix → fresh review) until satisfied; fight scope creep; write a rounds table into the **PR description** (not a comment).
- README one-liner: "Gets review from three models from different providers, and loops until they agree."

No claim here about what Theo said on video; only the published skill/README.

## Same pattern, two names (Sam's map)
| | pstack **panel** | tstack **council** |
|---|---|---|
| Shape | Fan out same task to N models; compare / synthesise | Fan out review to 3 providers; loop to agreement |
| Typical skills | arena, interrogate, architect runners | `council` (and sol-loop as single-provider cousin) |
| Cost knob | Panel list length + budget via `/setup-pstack` | Whether you invoke council at all; which members you name |
| Independence | Arena cross-judge must be another family; interrogate demands run-proven findings | Distinct providers; no substitute models |

Both are multi-model parallel judgment (or parallel generation + judgment). Useful vocabulary: say **panel** when talking pstack spend; say **council** when talking Theo/tstack review; treat the engineering idea as one pattern.

## Worth keeping (GHCP + pstack; GitHub only)

| Idea | GHCP move |
|---|---|
| Panel/council = N models on one problem | Several **custom agents** (or coding-agent sessions) with different model choices; thin orchestrator **skill** merges scores. Do not fake a council by renaming one Copilot model five ways (same warning as the earlier tstack note). |
| Read-only reviewers | Match Ondrej: fresh-thread **read-only** reviewer ≠ builder (`2026-10-29-ondrej-build-review-ship.md`). Council skill already says read-only for review. |
| Separate judge from builders | Match Holmes thread: do not let self-improvement and benchmarking share one weak judge (`2026-10-30-bholmes-factory-two-loops.md`). Arena's cross-judge-from-another-family is the pstack version of that rule. |
| Proven findings only (interrogate) | Reviewer skill must attach failing command output; CI / **Actions** as the check that can fail. |
| Cost control | Standing **instructions** / Memory for default panel size 1–2; reserve multi-seat panels for high-stakes diffs; optional **Agentic Workflow** or **Automation** that runs a council only on labelled PRs. |
| Setup as first skill | Port `/setup-pstack`-style role→model map into repo instructions so Copilot coding agents inherit cheap defaults. |
| Human merge gate | Panel/council propose; human **Actions** (or merge rules) still own one-way doors. |

## Caveats
- X post lists "~4" savings and only names `/setup-pstack` in the fetched text; the four guide bullets are from cursor/plugins docs opened this turn, not from missing X bullets.
- No images or video on the cu30rry_ post.
- Council skill forbids substituting models when a provider is missing; Copilot-only shops may only afford a weaker "panel of one" until multi-provider subagents exist.
- Panel generation (arena) and panel review (interrogate / council) share fan-out cost but different success criteria; do not conflate "graft the best candidate" with "loop until reviewers agree" when writing skills.

## Takeaway
Panel (pstack) and council (tstack) are Sam's two names for multi-agent / multi-model fan-out on one problem. That is where tokens go; cut spend with setup budgets, shorter panel lists, inherit-parent, and not invoking poteto-mode/council on trivial work. In GHCP: real separate custom agents, read-only reviewers (Ondrej), a judge that is not the builder (Holmes / arena cross-judge), proven findings where it matters, and human Actions on merge.
