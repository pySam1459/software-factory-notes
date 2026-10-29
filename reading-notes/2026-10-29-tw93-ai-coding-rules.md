# Tw93's 20 AI coding rules (English of his Chinese list)

- Shared: https://x.com/HiTw93/status/2115805352520282623 (29 Oct 2026, @HiTw93 / Tw93). Author reply: English version of yesterday's Chinese post.
- Chinese original (same day prior, more viral): https://x.com/HiTw93/status/2115366100221501540
- Blog write-up (21 rules; adds a harness/Waza bullet the X posts omit): https://tw93.fun/2026-10-29/practice.md
- No quoted post. No video. Related open-source: https://github.com/tw93/Waza (skills collection he cites as the harness he distilled).
- English X note_tweet is truncated/garbled in places; substance below is reconstructed from that text + the Chinese original. Blog numbering restarts per section; X posts use 1–20.

## The useful bits (for a software factory)
- **Hard rules need scripts, not prompts** (#8). Count done only when the check actually passes. Same as poteto traits→CI, m4lkxx walls, and Agentic Workflows gating traits.
- **Separate writer from reviewer** (#14); cap review at 3 rounds and from round 2 only look at new diffs (#15). Matches Tanveer Gill: agents don't grade their own work.
- **Verification script that accumulates** (#10): agent builds project checks, runs them, shows results; that becomes the agent test suite. Same family as the evals playbook (deterministic assertions first, CI gates) and Tanveer's receipts.
- **Risk tiers / one-way doors** (#16): deletions, payments, releases get human click-through. Same idea as m4lkxx "gate on cost of undo".
- **Fail twice → logs; fail thrice → clear context and restart with problem, goal, and what you already tried** (#12–13). Matches m4lkxx: stop when the same SAW repeats; escalate rather than thrash.
- **AGENTS.md / CLAUDE.md only for what the code can't teach, plus rejected approaches** (#7). Don't paste secrets. Close to Bun's CLAUDE.md and poteto's "hard constraints over prose".
- **"Look at / analyse" = read; "fix / change" = edit; commits/releases/deletes need OK** (#6). Cheap operational trait worth encoding.
- **Every prod bug / user report → a regression that runs before each release; rerun when switching models** (#19). Pair with the evals playbook's pass^k and versioned goldens.
- **Commits that say what changed, how verified, how to roll back** (#17): git history as agent context. Smallest usable steps so you can undo (#5). Parallel agents on separate worktrees, own commits only (#11).

## Fluff / already covered / take lightly
- "Wish-driven" / aim high / use the best model (#1–3): motivational, not a factory practice. Unverified that models are "good enough" for any given task.
- Ask before adding toggles/features nobody will use (#4): sensible product hygiene, not new.
- Beta / staged rollout (#18): product release advice.
- Blog's extra rule (build a project harness; Waza is his example): self-referential; Waza itself not reviewed here.
- No numbers, no before/after. Personal habits from the Mole/Waza author, not a measured factory claim.

## Takeaway
Steal the ones that harden verification and risk routing (#6–8, #10, #12–17, #19). Skip the cheerleading. Nothing here contradicts the existing notes; several lines are the same ideas in different words.
