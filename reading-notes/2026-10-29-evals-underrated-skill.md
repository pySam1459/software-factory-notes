# Evals are the most underrated skill in AI engineering

- Shared link: https://x.com/mchulet/status/2115640234016989228 (29 Oct 2026, @mchulet)
- Same 14-point list appeared a day earlier (and more virally) from @divaagurlxw: https://x.com/divaagurlxw/status/2115418017891020888 (28 Oct 2026). Replies on the mchulet post call out the copy; treat mchulet as a repost of the list, not the origin.
- No linked article, no video on the post, no author thread replies. Content below is from the long-form note text on the shared post.

## The 14 practices
1. **Error analysis before metrics.** Sample 100+ production traces; open-code failures in free text, then axial-code into categories; your top 3 categories become the first metrics.
2. **Versioned golden dataset.** Inputs, expected outputs/rubrics, metadata (intent, difficulty, segment); stratify rare critical cases; version alongside prompts.
3. **Synthetic data on explicit dimensions.** Persona × intent × complexity × edge case as tuples, then natural inputs — coverage, not 200 near-duplicates.
4. **Deterministic assertions first.** Schema, regex, required fields, length, code/SQL that actually runs. Reserve LLM grading for what code can't check.
5. **Split retrieval from generation (RAG).** recall@k / MRR / nDCG for retrieval; faithfulness for generation. Final-answer-only scores hide which half broke.
6. **Trajectory evals for agents.** Log every tool step; score precision/recall vs a reference path, argument correctness, step count, recovery. Right answer in 14 calls when 3 would do is a cost/latency bug.
7. **pass@k vs pass^k.** At least once vs every time. At 80% per-run, pass^5 ≈ 33%. Production reliability is pass^k; run cases multiple times at real temperature.
8. **Simulated users for multi-turn.** Persona + hidden goal + constraints; grade completion, turns-to-resolution, policy violations. Single-turn misses state/memory bugs.
9. **Align the LLM judge like a classifier.** Hand-label 100+; train/dev/test; iterate on dev; report TPR/TNR on test; binary + rubric + critique-before-verdict; pin judge model version.
10. **Control pairwise judge bias.** Swap A/B order; only count consistent verdicts; cap length if verbosity skews.
11. **Respect statistics.** 100 examples at 80% → ~±8pt 95% CI; 80→83 is probably noise. Bootstrap or paired tests before claiming a win.
12. **Gate deploys in CI.** Eval suite on every PR that touches prompts/models/tools/retrieval; per-category thresholds; fail on regression.
13. **Online evals.** Sample live traffic, async judges, alert on drift per category; shadow deploys for new prompts/models.
14. **Cost and latency as first-class.** Tokens/request, cost per successful task (not per call), p50/p95 next to quality.

Closing line: prompts are disposable; models get replaced; **eval infrastructure is what compounds.**

## Takeaway
- Fits the notes tightly: deterministic checks first = poteto / m4lkxx L3 ("a check that can fail", evidence ranked deterministic > self-report); CI gates + per-category thresholds = traits graduating to lint and Tanveer's "receipts or it doesn't merge"; LLM judges that don't grade their own work (fresh judge, pinned version, bias controls) = Tanveer's "agents don't grade their own work"; trajectory evals + pass^k = verification over reading code.
- Fills a gap next to mutation testing: this is the product/agent-side eval harness, not a test-suite mutagen. Both are "checks that can fail" that agents shouldn't invent on the fly.
- Unverified: the ±8pt CI claim and the pass^5 ≈ 33% arithmetic are textbook; whether anyone following this list ships better products is not evidenced in the post.
