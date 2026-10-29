# Ondrej's build → review → ship agent loop

- Source: https://x.com/DavidOndrej1/status/2115889290463052283 (29 Oct 2026, @DavidOndrej1 / David Ondrej, building [Cloudroom](https://www.cloudroom.dev/)). Caption only: "how I ship 133 commits per day with agents". No author thread or replies expanding it. Content is almost entirely in the attached flowchart image (`/workspace/ondrej-imgs/orig.jpg`, 1524×1308).
- Not a repo or product release — a personal pipeline diagram for his Cloudroom agent threads. Custom slash commands (`/4x4`, `/risky-changes`, `/gpt-review`, `/total-review`, `/opus-review`, `/prod-push`) and model names (opus 5.5, gpt-6 astra xhigh, fable, sol, muse) are his stack labels; not verified elsewhere in this post.

## What the chart says

Legend: yellow = human call; green = independent reviewer agents; grey = automated loops.

**1 · build** — Task starts in a Cloudroom thread. Bug? → loop: reproduce end-to-end like a real user. Else if big/risky? → human `/4x4 · /risky-changes` (his decisions + live measurements). Then builder loop ("opus 5.5 builds") → gate: tests · typecheck · screenshot of the real app.

**2 · review** — How big? Normal → `/gpt-review` (named model, **fresh thread · read-only**). Huge → `/total-review` (five named models, deduped). Every issue scored 1–10 as how-often × how-bad. Human filters must-fix vs overthinking; unsure → `/opus-review` second opinion; must-fix → he approves → builder fixes → **re-review the fix** (back to how-big). Exit when nothing left to fix.

**3 · ship** — `/prod-push` (pull --rebase → main) → release loop watches CI → side-effects & security loops check what landed. Finds a bug → new thread → back to 1.

## Worth keeping (pstack + GHCP software factory)

Sam's factory is **GitHub Copilot agents** (coding / cloud) plus pstack-style rigor (poteto: Lauren Tan's skill stack — [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack), standalone [backnotprop/pstack](https://github.com/backnotprop/pstack), Copilot-oriented port [michael-denyer/pstack-claude](https://github.com/michael-denyer/pstack-claude)). Map each Ondrej idea onto GHCP pieces; keep the pstack principle next to it.

| Chart idea | pstack angle | Build it with GHCP |
|---|---|---|
| Reproduce bugs like a real user before coding | Same as poteto verification / feature-map before scale | **Coding or cloud agent** with a **skill** that drives the app (browser/UI) and attaches evidence; store selectors/paths in **Copilot Memory** or a repo feature-map the skill always reads |
| Big/risky → human decisions + live measurements | poteto trust curve; don't parallelise what you don't trust | **Custom instructions** force a stop; **Actions** / form gates for yes; measurements from CI or agent-run benchmarks before the builder continues |
| Builder then hard gate (tests · typecheck · real screenshot) | "check that can fail"; soft skills graduate to hard CI | Builder = **coding agent** (or cloud agent on a branch). Gate = repo CI + a **skill** that refuses "done" without green checks and a real screenshot artifact |
| Fresh-thread read-only reviewer ≠ builder | poteto / Tw93: writer ≠ reviewer; agents don't grade their own work | Separate **custom agent** (or second cloud agent) with read-only instructions; no write tools; new session so it can't see the builder's rationalisations |
| Huge diffs → multi-model council, deduped | pstack `/arena` + `/interrogate`; tstack council | Multiple **custom agents** / model choices in parallel; a thin orchestrator skill merges findings. Where Copilot can't fan out models, fall back to one strong reviewer + severity ledger |
| Score issues how-often × how-bad; human filters overthinking | Severity ledger (blocker / should / nit); anti-scope-creep | Reviewer **skill** outputs a fixed rubric table; human (or **Agentic Workflow** comment via safe outputs) decides must-fix; nits declined with a written reason |
| Re-review the fix | `/correct`-style loop | After builder patch, re-invoke the reviewer agent on the new diff only — same skill, fresh or continued review thread |
| Ship = rebase→main, watch CI, then side-effect/security loops | tstack babysit-pr / full-send gates; poteto CI hard constraints | **Copilot Automations** or **Agentic Workflows** (Markdown→Actions) watch the PR/CI; post-merge **Automation** runs side-effect/security checks; on failure open an issue/thread that starts build again. **Caveat:** Agentic Workflows are GitHub Actions — on ADO mirror the loops as ADO pipelines + Copilot where licensed |
| Bug found after ship → new thread back to 1 | Closed-loop factory, not one-shot chat | Automation creates the work item / agent task with the failing evidence linked; **Memory** keeps standing factory rules so the new thread starts from the playbook, not a blank chat |

Practical shape for the MSFT Python + TypeScript repo: one **builder custom agent** (pstack `/poteto-mode` or ported playbooks via skills/instructions), one **read-only reviewer custom agent**, CI as the hard gate, Agentic Workflows/Automations for babysit + post-merge checks, Memory for the feature map and standing traits, Actions for human one-way doors (prod push, risky change).

## Caveats
- **"133 commits per day"** is a caption claim; the post gives no method, time window, or repo evidence. Treat as marketing, not a target.
- Chart is **Cloudroom-specific**; slash commands and model nicknames are his, not portable names. Steal the loop shape, not the labels.
- Image readable (orig 1524×1308). No second image on the post.
- Multi-model `/total-review` needs a harness that can actually run several models; don't fake a council with one Copilot model renamed five ways (same warning as tstack council).
- Unverified: whether his release/security loops are agents, classic CI, or both — chart only says "loops check what landed."

## Takeaway
Steal the three-phase loop with an independent read-only reviewer, a severity filter that kills overthinking, re-review of fixes, and post-merge side-effect checks that restart the factory. Implement it as GHCP custom agents + skills/instructions + CI gates + Automations/Agentic Workflows + Memory + human Actions; keep pstack's verification and writer≠reviewer principles as the policy those pieces enforce.
