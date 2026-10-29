# Harness, Loops, Graphs (plus another poteto live-session repost)

- Post: https://x.com/DuduSavlucms4/status/2115203229818446125 (27 Oct 2026), a 53-minute clip of Lauren Tan (poteto), very likely the same live session as `2026-10-28-poteto-agent-team-workshop.md` (video not reviewed; download was blocked).
- Hype claims in the post (60+ agents, 3,500 PRs merged last month, "haven't read their code in months", "every review comment I ever left is now a CI rule") are the poster's, unverified.
- Quoted article: m4lkxx, "Harness, Loops, Graphs: What Each Layer Fixes and What It Breaks": https://x.com/m4lkxx/status/2114338456750997922

## The ladder
- L0 chat: you are the whole program.
- L1 harness, hands: shell, files, tests, git. Ten narrow tools beat forty overlapping ones; smallest environment that can finish the job.
- L2 harness, memory and walls: PROGRESS.md (goal, tried, known, next, never), git checkpoints, artifacts by reference. "The context window is RAM, the harness is the disk." Walls: least privilege, sandbox, allow-lists, budgets. "A wall is not an instruction."
- L3 loop, a check that can fail: evidence ranked deterministic > observable trace > independent reviewer > self-report. "A check is only as strong as the weakest thing it accepts as proof." The new test must fail on old code. Writing the check is writing the spec.
- L4 loop, feedback that converges: EXPECTED / SAW / FENCE / DEAD ENDS. Exit on green, on the same SAW twice (escalate), or on budget.
- L5 graph, shape: node = one bounded job; edges only for real dependencies ("what breaks if B starts before A?"); one context per worker; deterministic steps are code; gate where work leaves a node.
- L6 graph, gates: freeze what passed; rerun only failed nodes. Gate on the price of undo: one-click undo ships on green; cleanup undo needs green + trace + second opinion; no undo (migrations, deletes, sent emails, money) needs a person. The model labels, code decides what the label unlocks.
- L7 learning: put each lesson on the layer that owns it (tool, memory entry, required check, split rule). A lesson is a constraint, not a transcript.
- Climbing: you can't skip levels; design from L3 (define green first); most tasks are done at L4.

## Takeaway
- Matches poteto: hard constraints over prose, verification first, review comments become CI rules (traits graduating to lint).
- New framings worth stealing: gate on cost of undo rather than confidence; stop when the same failure repeats twice; a "never" list in agent memory.
