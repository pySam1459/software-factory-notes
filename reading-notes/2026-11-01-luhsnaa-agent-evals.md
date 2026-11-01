# @luhsnaa: agent evals map (and Loopbreak playground)

- Source: https://x.com/luhsnaa/status/2116919712156430385 (1 Nov 2026, 15:46 UTC / 15:46 Europe/London). Post body is only the X Article link. Article id `2114076677395668992`, title **everything you need to know about agent EVALS**. Metrics at fetch: about 29 likes, 45 to 47 bookmarks, ~1k impressions, 1 reply.
- Author: **@luhsnaa** (display name **anshul**). Bio: "ai engineer… building [Arbityr](https://www.arbityr.live/) | 7x hackathons". Arbityr is a separate product (decision-review skill / voice waitlist), not the eval article itself. ~290 followers at fetch. Not an official Hamel, Anthropic, or Langfuse account.
- Companion playground (author-built): https://loopbreak-eval.vercel.app/ (**Loopbreak**). Fake movie-ticket agent "Reel" with labelled failure modes and levels that mirror the article stages. Live at fetch (1k simulated conversations, ~87% pass rate on v1 UI).
- One reply: **@anmol_rerato** (Anmol Dhingra) https://x.com/anmol_rerato/status/2116921092304453876: scoring 95% on evals you wrote yourself is how a bad agent ships; missing test is live and adversarial: revoke tool access mid-run and confirm it stops, with a receipt of the last allowed action.
- Article images saved beside this note: `2026-11-01-luhsnaa-agent-evals-loopbreak-judge.png` (Loopbreak judge UI), `2026-11-01-luhsnaa-agent-evals-two-loops.jpg` (outer build loop / inner evals loop diagram).
- Related earlier notes: Ray Amjad Prove It / verifiers (`2026-11-01-ray-amjad-claude-code-verifiers.md`); Ashpreet simulations/traces/evals (`2026-10-30-ashpreetbedi-simulations-traces-evals.md`); ai-evals-course skills (`2026-10-30-evals-skills.md`); Ben Holmes two loops (`2026-10-30-bholmes-factory-two-loops.md`).
- Folder: **reading-notes/** (agent product evals; not ux, poteto-advice, or formal-verification).
- Sam's project is on GitHub: GHCP mapping only (no ADO).

## Verdict (lead)

**Useful 80/20 map with a real playground; not primary research.** @luhsnaa synthesises Hamel/Shreya FAQs, Anthropic's demystifying-evals post, Langfuse academy pieces, Eugene Yan, τ-bench, and a Jev bonus into one readable roadmap plus Loopbreak. The strongest claims (LangChain harness lift, Anthropic capability vs regression, pass^k, grade outcome not path, CORE-Bench grading bugs) match the cited primaries. Treat the title, the "46 resources" count, the personal 95% story (still has a placeholder for what actually broke), and the early Jev leaderboard numbers as framing or second-hand until you re-run them on your own traces. Steal the inner/outer loop, error-analysis-first order, binary checks, and TPR/TNR discipline for the GHCP factory; keep @anmol_rerato's revoke-tools adversarial idea as an extra Actions check.

## What the Article says

### Frame
Author had an agent at **95% on self-written evals** that still failed users. Goal: turn gut feel into a dashboard, and give a breadth-first map because there is no single copy-paste recipe. Explicitly **80/20**, not every technique. Reading traces builds intuition; the article cannot replace that.

### Two loops (evals as anchor)
- **Outer loop:** change prompt/tool/memory/harness/model, then ship, then watch prod, then pick the next change.
- **Inner loop (evals):** before ship, run the golden dataset (GDS); after ship, read traces, name failures, turn them into dataset items and checks.
- Cites Langfuse **AI engineering loop** (trace, monitor, build datasets, experiment, evaluate) and LangChain harness engineering (model fixed, harness only: **52.8 to 66.5** on Terminal Bench 2.0).

### Ideal order (most people start at step 5)
1. Question requirements: read traces (error analysis).
2. Delete: most failures do not need an eval (fix with a prompt, or ignore if it would not change a ship/rollback decision).
3. Simplify: pass/fail, one check per failure; code first (grade the database / outcome, not only the transcript).
4. Accelerate: GDS cheap enough for CI on every prompt/model change.
5. Automate **last**: LLM judge only where reading is required.

Hard constraints (compliance, output format) get a check on day one. Soft failures wait until they appear. Lands between Anthropic (eval-driven development early) and Hamel ("write evaluators for errors you discover, not errors you imagine").

### Error analysis
Pull ~100 traces; first **30 by hand**; pass/fail plus a note in your own words; group into failure types; stop when the last ~20 add no new category (Langfuse cookbook rule of thumb). Do not outsource early labelling to an LLM (criteria drift: Shreya). "Helpfulness" never shows up; concrete failures do ("said refund went through when the tool call failed").

### Golden dataset
Real inputs plus expected good answers. Start from real failures. Anthropic: **20 to 50** tasks is a fine start; grow past 100 as needed. Two domain experts should agree on pass/fail or the item is ambiguous.
- **Capability** evals: hard on purpose; low pass rates are healthy (~70% can be useful signal).
- **Regression** evals: near **100%**; catch backsliding.
Capability items that pass reliably **graduate** into regression. A single blended 95% hides both stories (the opening failure mode).

### Judges and reliability
- Binary only; no 1 to 5 Likert.
- Judge prompt: one criterion, examples from your labels, reasoning then verdict, allow **unknown**.
- Do not trust raw agreement: always-pass judge can look ~90% accurate when failures are rare. Track **TPR** (catch real failures) and **TNR** (leave good outputs alone) on held-out labels. Hamel/Shreya-style train/dev/test split; benevolent dictator labels.
- Prefer a decent judge on every trace over a perfect one you cannot afford.
- **pass@k** (at least one success in k) vs **pass^k** (all k succeed). Customer-facing reliability wants pass^k (τ-bench). Example: 80% per trial gives pass^3 of about 51%.
- Grade **outcome**, use path to debug; exception: hard rules (e.g. verify customer before refund).
- If every run fails, suspect the grader/task (Anthropic CORE-Bench anecdote: 42% became 95% after grading fixes).
- CI protects known regressions; monitoring finds unknowns. Keep **evaluators** (after the fact) separate from **guardrails** (in the request path).

### Two recipes
- **Already in prod:** trace everything; error analysis; delete; code checks; judges with TPR/TNR; feed failures into GDS; CI with pass^k plus online sample judges and user/ops signals.
- **Early build:** small GDS (20 to 50); hard-constraint checks day one; read every output; judges only where needed; CI; turn tracing on early. Synthetic data via dimension tuples (persona x intent x edge x mood), not "50 similar questions". Multi-turn: simulated user and grade final DB state (τ-bench shape). Trajectory metrics for debug, not usually as a release gate.

### Bonus: Jev (TypeSafe)
Decision-only "system one" model: typed questions in, probabilities out; cannot write prose. Cheap/fast enough to score every trace. Early third-party numbers (Arize, inovex, BERI, Langfuse/Good Start Labs) put it a few points behind frontier LLM judges at a tiny fraction of cost. Caveats: no WHY, cannot abstain unless you add an option, score wobble / option-order sensitivity, weak at counting/dates/multi-step; still need code for exact matches and LLM judges for debug. Author: atomic questions per failure type, TPR/TNR on your labels, probability bands, pin model version. Waitlist noted at launch.

### Monday checklist
Pull 100 traces; read 30; group; delete prompt-fixable noise; one check for the worst remaining failure; measure; play Loopbreak.

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| LangChain deep agent 52.8 to 66.5 on Terminal Bench 2.0 by harness only (gpt-5.2-codex fixed) | **True** in LangChain's own post | https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering |
| Anthropic: 20 to 50 real-failure tasks to start; capability vs regression; graduate when near 100%; grade outcome not path; pass^k example ~75%^3 ≈ 42%; CORE-Bench Opus 4.5 42% became 95% after grading/scaffold fixes; Swiss cheese layering | **True** in Anthropic engineering post (9 Jan 2026) | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents |
| τ-bench introduces pass^k; grades final DB state vs annotated goal; simulated user | **True** (arxiv abstract) | https://arxiv.org/abs/2406.12045 |
| Loopbreak playground exists and mirrors the article stages | **True** (site live at fetch) | https://loopbreak-eval.vercel.app/ |
| "46 resources" surveyed | **Author inventory** of the reference list (Hamel FAQ cluster, Langfuse, Eugene Yan, Anthropic, papers, Jev writeups). Count not independently re-tallied item-by-item. | Article references section |
| Agent scored 95% then failed users; exact root cause | **Author anecdote.** Body still contains placeholder text "[anshul: what it actually was, and what fixed it]" so the personal fix is not disclosed in the published article text we fetched. | Article wrap-up |
| Hamel/Shreya: error analysis most important; binary over Likert; automate judge last; TPR/TNR; do not outsource early intuition | **Directionally matches** their public FAQ/course materials (widely linked). Individual FAQ pages not every one re-opened this turn. | https://hamel.dev/blog/posts/evals-faq/ |
| Jev cost/accuracy figures (91.5% agreement, spam 98.3%, phishing 62.6% then 95% when split, etc.) | **Second-hand** from cited Arize / inovex / BERI / Langfuse posts. Plausible but not re-run here; agreement-with-another-model is the same trap the article warns about. | Linked Jev writeups |
| Title "everything you need to know" | **Mild clickbait / marketing.** Body immediately hedges to 80/20 and "map of the territory". | Title vs intro |
| Bio product Arbityr is an evals platform | **No.** Arbityr is decision-review / "defend it before you build it"; Loopbreak is the evals playground. | https://www.arbityr.live/ |

## What to steal vs skip

**Steal**
- Evals as the **inner loop** inside every ship decision; outer loop is still building the agent.
- Error analysis before metrics: 30 hand-labelled traces, concrete failure names, delete most of the list.
- Capability vs regression split so a single 95% cannot lie.
- Code checks on outcomes (DB / receipts) before LLM judges on prose.
- TPR and TNR on held-out labels; never ship a judge on agreement alone.
- pass^k in CI for anything users expect every time; pass@k only when retries are fine.
- Feed prod failures back into the GDS on a schedule so the suite does not go stale.
- Optional: try Loopbreak once as a teaching tool; optional adversarial check from @anmol_rerato (revoke tools mid-run plus receipt).

**Skip / caveats**
- Do not treat this as a substitute for reading Hamel FAQ or Anthropic's post when designing your suite.
- Do not adopt Jev as the sole judge without your own TPR/TNR and a path to explain failures.
- Author is early-career / building Arbityr; synthesis quality is high, authority is "careful reader", not the primary labs.
- Placeholder in the 95% story means you do not get a worked case study of their fix.

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills / instructions** | Standing factory rule: no "done" without a named check (code outcome first). Error-analysis skill: pull N traces, pass/fail plus note, group, propose which failures become GDS items. Judge-writing skill: one criterion, unknown allowed, demand TPR/TNR report before merge. |
| **Coding agent** | Builder implements; separate path writes/owns graders where possible (same spirit as Prove It answer keys). Prefer grading final state fixtures over brittle tool-order asserts. |
| **Custom agents** | Optional "eval curator" agent that only labels traces and proposes dataset PRs; never edits product to greenwash scores. Optional "judge auditor" that reports TPR/TNR only. |
| **Actions** | GDS job on every prompt/skill/model change; multi-trial pass^k gate on critical paths; separate online-sample judge job (not a request-path guardrail). Add an adversarial job: revoke tools mid-run, assert stop plus last-allowed-action receipt (@anmol_rerato). |
| **Agentic Workflows** | On prod thumbs-down / Sentry / long-trace labels: open a PR that adds a GDS item. Scheduled refinement: graduate saturated capability cases into regression; delete ambiguous items experts disagree on. |
| **Memory** | Store failure-type taxonomy, judge TPR/TNR snapshots, and which GDS items came from which prod incidents. Do not store "the agent is at 95%" without the capability/regression split. |
| **pstack** | Matches poteto-mode verify-before-trust and the Ray Amjad verifier note: humans own criteria and answer keys; agents hill-climb. Loopbreak is a sandbox for teaching the loop, not a production harness. |

## Takeaway

Solid BFS map of agent product evals with a playable demo. Primaries check out on the big engineering claims. For Sam: wire error-analysis, then binary outcome checks, then a capability/regression GDS, then pass^k Actions gates into the GHCP factory; keep LLM/Jev judges calibrated and last; treat the title and Jev scoreboard as packaging around advice that already lives in Hamel and Anthropic.
