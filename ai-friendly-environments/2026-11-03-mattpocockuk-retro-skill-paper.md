# /retro skill paper (@mattpocockuk)

Source: [@mattpocockuk on X, 3 Nov 2026 12:04 UTC](https://x.com/mattpocockuk/status/2117588845864575397), plus [his follow-up at 12:06](https://x.com/mattpocockuk/status/2117589185825829324) and [reply to @oviava](https://x.com/mattpocockuk/status/2117590024971542700).

The t.co link in the post (`https://t.co/IYo4rhz1Vp`) resolves with a 301 to the paper PDF, not a GitHub issue: [arXiv:2610.34938](https://arxiv.org/abs/2610.34938) / [PDF](https://arxiv.org/pdf/2610.34938). Matt calls it "the greatest issue report in history" because the paper is an empirical assessment of his `/retro` skill. No matching issue filing the paper against [mattpocock/skills](https://github.com/mattpocock/skills) was found (unverified that one exists elsewhere).

Paper: Christoph Treude (Singapore Management University) and Sebastian Baltes (Heidelberg University), "How Do Coding-Agent Harnesses Self-Evolve? An Empirical Study of Retrospective Adaptation," arXiv:2610.34938v1, 26 Oct 2026. Artifact: https://doi.org/10.5281/zenodo.23653700. Study used `/retro` at commit `b0618bc` of mattpocock/skills.

## What `/retro` does

From [`skills/engineering/retro/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md) (same path and content at `b0618bc` as checked today):

- User-invoked only (`disable-model-invocation: true`). Suggests improvements to the agent's **environment** (harness), not a rewrite of the finished patch.
- Loads the `writing-for-agents` style guide, reads the named session (or the current one), then looks for candidates in: navigation pointers, automated checks / guardrails, coding standards for the reviewer agent, pruning global `AGENTS.md`, tool economy, no-op instructions, and information access.
- Explicitly treats a repo with neither a pre-commit hook nor a CI lint/typecheck/test job as a finding (a standing missed opportunity). That line is what the paper links to the prior-driven lint proposals.
- Presents numbered candidates to the user in severity order. Human approval is assumed; the skill itself does not apply edits.
- Prefers navigation pointers in `CLAUDE.md` / `AGENTS.md`, deterministic checks over prose rules, and `CODING_STANDARDS.md` only for judgement calls.

## What the paper did

Method (human-in-the-loop self-evolution, not an autonomous loop):

- Agent: Claude Code 2.1.295 with Opus 5.5, non-interactive, same task prompt template.
- Tasks: 30 SWE-bench Verified issues (10 exploratory, two each from Django, SymPy, Matplotlib, Astropy, Sphinx; then 20 more from Astropy, pytest, Sphinx, SymPy chosen where environment problems had already shown up).
- After each session, `/retro` produced proposals. Total: **125** proposals (two to six per retrospective).
- Qualitative coding of every proposal (trigger: experience-driven / prior-driven / weak; plus mechanism codes). Two LLM coders (Claude Code with claude-fable-5-1 on full traces; GPT with gpt-6.1-sol on excerpts), first author resolved disagreements. Same trigger on 109/125 (κ = 0.67); same mechanism on 109 (κ = 0.84).
- Implemented **24** proposals; evaluated **12** harness changes (11 experience-driven adaptations that could transfer, plus one author-written pre-commit comparison from a prior-driven proposal) on later issues from the same repos.
- Transfer design: for each adaptation, five fresh sessions with the original harness and five with the adapted harness. "Informative" when at least three of five original-harness sessions encountered the targeted problem. Recurrence = later session still performing the action the adaptation was meant to prevent.

## What it found (numbers from the paper only)

**RQ1 (what `/retro` proposes):**

- Of 125 proposals: **101** experience-driven, **19** prior-driven, **5** weak.
- Most common mechanism: executable checks (**38** of 125, in 29 of 30 sessions). Only **9** of those 38 could actually report failure in the task environment as written.
- Lint-related: **43** proposals across 29 of 30 sessions. Of those, **23** experience-driven, **18** prior-driven, **2** weak. Lint accounted for **18 of the 19** prior-driven proposals overall. So @solomonmithra99's "18 of 43 lint proposals recommended a practice regardless of what happened in the session" matches the paper.
- Known-failures files proposed in **15 of 30** sessions.

**RQ2 (do implemented changes help later?):**

- **7** informative transfer events.
- Of those seven: **2** changes eliminated the targeted action, **1** reduced it, **4** showed no reduction.
  - Eliminated: SymPy `CLAUDE.md` line naming `bin/test` (recurrence **5/5 to 0/5**); Astropy known-failures file listing three tests (**3/5 to 0/5**).
  - Reduced: Astropy cache-repair plugin + script (**5/5 to 2/5**).
  - No reduction: incomplete Sphinx / SymPy / pytest known-failures files where later sessions hit failures absent from the list (often still **5/5** recurrence while consulting the file).
- Incomplete known-failures can **add** work: on a Sphinx control (unrelated) issue, **4 of 5** adapted sessions ran baseline comparisons versus **0 of 5** under the original harness. That supports @harshit10sehgal's reading that a half-finished known-issues file can be worse than none.
- Task success differed by at most one session between harnesses in every event: no consistent evidence the adaptations improved success.
- Timing mixed: the SymPy pointer that removed pytest also told the agent to run CI lint before finishing; median elapsed time rose from **88 to 156** seconds. One Sphinx control rose from **82 to 245** seconds.

Headline quote (also in Matt's follow-up): "Harness self-evolution requires more than generating and implementing changes: it needs ways to establish whether a change helps on later tasks and to revise or remove changes that do not."

Limits the paper itself states: one agent, one `/retro` version, mostly environment problems; evaluation issues were selected to reproduce the targeted problem (may overestimate help on arbitrary later tasks); small counts (five sessions per harness, seven informative events); labeling not fully blind.

## Matt's take and useful replies

- Matt: we need to `/retro` whether our `/retro` changes actually made a difference.
- To @oviava ("That's just evals"): on a running system that is observability over time, and keeping track of which bugs were prevented over time.
- @solomonmithra99: 18 of 43 lint proposals prior-driven (confirmed above).
- @harshit10sehgal: half-finished known-issues worse than none (supported by the Sphinx control result).
- @Tsury: retro findings must cite their triggering event; retro-made rules that never fire get cut.
- @dnzxlyfe: retro only proposes; human approves each; a week later check whether the targeted failure came back; drop edits that moved nothing.
- @RealAhmedGamal: fixed eval set before and after each change; tag each change so it can be ablated.
- @i_mika_el: needs held-out tasks (else it optimises for its own last test).
- @coldbird8: no-skill baseline to separate skill text from just pausing to reflect (not in the paper; unverified).
- @FixChatWill: prefer pointers like `bin/test` over known-failure lists (matches the paper's strongest win).

## GHCP mapping for Sam's factory

Sam's stack uses custom instructions, skills, and Copilot Memory. Map the paper's lesson (propose, human approve, measure on later tasks, then prune) onto that stack:

1. **Retro Agentic Workflow** that, after a coding-agent or Agentic Workflow session, opens a PR proposing edits to `.github/copilot-instructions.md`, `.github/instructions/`, or skill `SKILL.md` files. Human approves via normal review. Do not auto-merge instruction changes.
2. **Cite the trigger** on every proposed edit (session id, PR number, failing check, or log excerpt), matching @Tsury and the paper's experience-driven vs prior-driven distinction. Prefer navigation pointers and wired guardrails over growing known-failure lists (@FixChatWill; SymPy win vs Sphinx miss).
3. **Fixed eval set** of past factory tasks (or past red builds) re-run before merging instruction or skill changes (@RealAhmedGamal, @i_mika_el). Hold some tasks out. Tag each merged rule so it can be ablated and pruned when unused or ineffective.
4. **Follow-up check** (scheduled Agentic Workflow or Actions job): a week later, did the targeted failure class recur? Drop or open a revert PR for edits that moved nothing (@dnzxlyfe).
5. **Copilot Memory** already stores repository facts with citations and re-validates them against the current branch before use ([About Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)). That is closer to "cite and re-check" than to `/retro`'s durable file edits. Docs still say: for instructions that must always apply, use custom instructions, not Memory. Use Memory for durable repo facts (test command, layout); use reviewed instruction/skill PRs for harness rules; use the eval/prune loop so neither layer accumulates dead weight.
6. Treat "repo has no CI guardrail" as a one-time finding with a wired check, not a recurring `/retro` proposal every session (the paper's prior-driven lint pile).

Unverified: whether Sam already has a fixed eval pack of past tasks; whether any GitHub preview auto-prunes unused custom instructions; the @coldbird8 no-skill baseline (not studied here).
