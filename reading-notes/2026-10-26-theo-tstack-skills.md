# Theo's tstack agent skills (26 Oct 2026)

- Post: https://x.com/theo/status/2114623574371963360 (≈30-min video announcement)
- Repo reply: https://x.com/theo/status/2114623745486958945 → https://github.com/t3dotgg/tstack
- Author: Theo Browne (@theo / t3dotgg). MIT. Claude Code + Codex; optional T3 Code with native fallbacks.
- Latest commit reviewed: `92e38e2` ("fix(full-stop): trigger on a closing Full stop."), 27 Oct 2026 09:27 Europe/London.

## Summary
tstack is Theo's everyday personal agent skills for the pull-request lifecycle, cleaned up for public use. The centre of gravity is autonomy with a phrase gate: say "full send" and the agent owns the work through a merged PR; say "full stop" and it stops at merge-ready. Everything else is either a building block of that path (proof, Sol review, file PR, babysit CI) or a related workflow (council review, take over someone else's branch, modernise an ageing PR, format agent comments). Skills call each other; install is a straight `cp -R skills/*` into `~/.claude/skills/` or `~/.codex/skills/`. Requirements: authenticated `gh`, plus `python3` for `babysit-pr`'s watcher. Personal settings (which models sit on the council) go in `CLAUDE.md` / `AGENTS.md` so the skill files can be updated without losing them. The announcement video was not transcribed for this note; content below is from the published repo (README, every `SKILL.md`, `agents/openai.yaml` files, and the `pr-wait` script).

## Skills

### full-send ("full send")
Unattended path from current state to a **merged** PR. The explicit phrase is the permission grant: merge when the gate passes, `--force-with-lease` on this task's branch, and run Proof methods (including computer use / browser / simulators) without ask-first rules. Pipeline: finish the smallest change → Proof → `sol-loop` → `file-pr` → `babysit-pr` → merge → report (link, merge commit, proof, decisions made for the user). Must stay active; ends the turn only while a watcher will wake it. Asks only via harness question tools (`AskUserQuestion` / `request_user_input`) when proof fails, the gate can't pass, or the next step is outside the grant (production, data deletion, other branches). Never `--admin`.

### full-stop ("full stop", including a closing "Full stop.")
Same workflow and testing permission as full-send, **never merges**. Disables auto-merge / merge queues before work and again before each push. Handoff when the merge gate would pass, or report waiting-for-human-approval / blocked.

### council ("council")
Three delegates, one strong model per provider (defaults: Claude Opus, GPT Sol, Gemini Pro; override via user instructions). T3: `orchestrator_capabilities` then parallel `delegate_task`. Elsewhere: harness subagents. If three providers aren't reachable, report — do not substitute. Read-only for review; score out of 10; loop until satisfied; fight scope creep; write a rounds table into the PR description (not a comment).

### sol-loop ("sol loop")
Review loop with **GPT Sol only**. Budget: 3 rounds default, 5 only for security/auth/data-loss/concurrency while a blocker/should stays open. Severity ledger with stable ids (blocker / should / nit). Decline nits and out-of-scope; smallest fix only; no push during the loop; no model substitute if Sol can't run. Round-1 brief forces VERDICT + structured findings. Used by full-send before filing.

### file-pr
File a short PR. Lead with the user's problem, not an inventory of diffs. Title should explain why it matters (look at recent merges for convention). End with `Created with <model> in <harness>.` Open a real PR (not draft) so review bots run. REST `gh api` fallback when GraphQL is exhausted. Secrets check on title/body/attachments.

### takeover
Finish someone else's PR, branch, or agent thread. Preserve Git authorship and co-author trailers; credit humans in the description (and squash merge commit); don't defend a bad prior implementation. Use `modernize`, then `file-pr` / `babysit-pr` / `leaving-pr-comments`. Merge or close the original only when authorised.

### babysit-pr ("babysit")
Monitor one PR through CI and review bots. **Never** hand-roll poll/`sleep` loops. T3: `watch_pull_request` / `unwatch_pull_request`. Else: bundled `scripts/pr-wait` (556-line Python3: per-PR lock, state under `~/.local/state/pr-wait/`, GraphQL + REST, Greptile/Macroscope as gating bots, CodeRabbit advisory only, exits 0/1/2). Verify every finding against source; decline cheap scope creep with a written reason; rebase when BEHIND/DIRTY; merge only if the user asked.

### modernize
Rebase an old PR and judge whether it should still exist. Dispositions before push: **MODERNIZE** / **REWORK** / **CLOSE**. Conceptual conflicts (deleted code, two ways to do one thing, superseded behaviour) beat a clean rebase. `--force-with-lease` only; never close without permission; disposable worktree if dirty.

### leaving-pr-comments (automatic whenever commenting on GitHub)
Prefix agent-authored comments with a GitHub NOTE callout naming the verified model and the user. Direct style; secrets check; not for PR descriptions, commit messages, or verbatim user text.

## Patterns worth copying
- Phrase-gated autonomy with an explicit grant boundary.
- Thin orchestrators that call specialised skills (composition over one megaskill).
- Proof = evidence observed this session; mocked green ≠ UX proof.
- Anti-scope-creep written into every review loop.
- Harness adapters (Claude Monitor + `pr-wait`, T3 watchers, Codex `agents/openai.yaml` on four skills) instead of assuming one runtime.
- Personal knobs outside skill files.
- Event-driven, rate-limit-aware waiters instead of agent-written polling.


## Install, layout, compatibility
- Clone and `cp -R tstack/skills/*` into `~/.claude/skills/` (Claude Code) or `~/.codex/skills/` (Codex).
- Layout: one directory per skill with `SKILL.md` (YAML frontmatter `name` + `description` trigger text). Four skills also ship `agents/openai.yaml` (Codex display name / default prompt). Only `babysit-pr` has a helper script (`scripts/pr-wait`).
- Skill lengths are short by design (~40–120 lines of instruction); the heavy engineering is in `pr-wait`, not prose.
- Composition graph from the README: full-send → sol-loop + file-pr + babysit-pr; full-stop → full-send; takeover → modernize + file-pr + babysit-pr + leaving-pr-comments; file-pr / babysit-pr / modernize → leaving-pr-comments.
- T3 Code optional: `delegate_task`, `watch_pull_request`, `orchestrator_capabilities`. Without T3, council/sol-loop need another multi-model harness; babysit falls back to `pr-wait`.

## Takeaways for us
- Best port into the Michelin kitchen as **workflow** skills, not product-domain ones: file-pr's problem-first descriptions, leaving-pr-comments attribution, modernize's willingness to say CLOSE, and the Proof / merge-gate language.
- Closest to poteto and traits: verification and environment beat the prompt. sol-loop is a light `/correct` cousin (review → minimal fix → re-check) but hard-wired to GPT Sol and T3 `delegate_task` — port the **loop shape and ledger**, not the Sol dependency.
- Copilot SKILL.md: the markdown workflows mostly port. `pr-wait` ports if the agent can run long `gh` commands. council / sol-loop need multi-provider subagents; Theo forbids substituting models, so don't adopt those until the harness can actually run them.
- Prefer **full-stop** as the default grant for work repos; keep full-send merge autonomy behind clear branch protection and human norms.
- Don't paste the whole stack. Keep skills non-overlapping; put model choices in AGENTS.md; treat Greptile/Macroscope-specific waits as optional.
