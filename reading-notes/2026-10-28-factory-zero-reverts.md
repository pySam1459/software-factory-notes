# A software factory with zero reverts (Tanveer Gill, Traycer)

- Source: https://x.com/GillTanveer89/status/2115504902847988168 (28 Oct 2026)
- Quotes his article "How to build a software factory from zero": https://x.com/GillTanveer89/status/2114764081978908775

## Numbers (self-reported)
- 453 factory PRs merged, 0 reverted. 420 shipped clean; 24 tripped a post-merge CI check (22 self-fixed); 5 partial fixes finished by a follow-up; 4 real bugs.
- Week one, 12% of merges broke a check; now 3%.

## Three rules
1. Receipts or it doesn't merge: bug before, fix after, plus what it couldn't check.
2. Agents don't grade their own work: fresh reviewers never see the author's conclusion; on tricky PRs reviewers debate.
3. The factory ships the boring stuff; anything flagged high-risk goes to a human.

## The article (roundup of Matt Pocock, poteto, Dex Horthy, Zach Lloyd, Ben Holmes, OpenAI via Gergely Orosz)
- Step 0: make the codebase hard to get wrong (poteto's trust pyramid: code > static analysis > prose > human review; feature maps).
- Verification artifacts per change ("tests prove the test; recordings prove the product"); TLA+ for sync code.
- Align before code (Matt's /grill-me, /to-prd, /to-tickets; Dex's design levels).
- Start with one trigger and one job; sandbox agents; agents hold read tokens only, a rules-and-budget gateway holds posting keys; untrusted input is data.
- Agents review first (blind reviewer, risk tiers); humans review proof.
- The PR author agent owns it to merge; close the loop back to the user.
- Self-improvement ("factory engineering"); measure shipped work, not tokens.
- Lesson: don't use an LLM as the filter for what gets through; plain rules and budgets.

## Takeaway
- Maps onto poteto: receipts = verification, blind reviewers = cross-model judge, risk routing = trust curve.
- Treat the numbers as vendor marketing; the article is the more useful read.
