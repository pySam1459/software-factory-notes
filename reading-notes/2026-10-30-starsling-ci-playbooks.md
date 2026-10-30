# StarSling CI Playbooks (agent-friendly GHA optimizations)

- Source: https://x.com/yonasbe/status/2115887191780122713 (29 Oct 2026, @yonasbe / Yonas Beshawred, Co-Founder @starslingdev). Long-form note + ~24s promo video (not watched; preview frame only) + author thread with seven chart images under `/workspace/yonasbe-imgs/`.
- Product page: https://starsling.dev/ci-playbooks (markdown twin: https://starsling.dev/ci-playbooks.md). Open skills: `npx skills add starslingdev/skills` → https://github.com/starslingdev/skills (ci-speedup, ci-score, ci-secure, sling). Paid pitch: StarSling runners + agents that open CI PRs (https://starsling.dev/products/runners).
- Method claim: 416 PRs/commits + 182 posts/talks/podcasts from ten companies, translated into GitHub Actions equivalents where the company used something else. Last updated 2026-10-29 on the site. Stats on the page: 253 techniques, 226 merged PRs, 10 playbooks.

## What it is
An **agent-friendly library** of CI speed/cost techniques. Each technique cites a source and ships a prompt a coding agent can run on your repo. Hand the playbooks URL (or `.md`) to an agent with a paste-ready eval prompt: measure baseline → fit-check techniques → ask which to apply → one commit per technique on a new branch → never merge/push protected → keep required checks.

Ten company playbooks (one-line focus from the index): Anthropic (affected tests), DoorDash (parallel build/test + shards), Linear (benchmark same job on faster hardware), Mastra (StarSling runners for slowest workflow), OpenAI (rank fixes by minutes saved), Ramp (CPU-bound suite on faster CPU), Shopify (agent iterates one CI metric), Spotify (arm64 on native arm64), Stripe (tests a change can reach), Uber (merge-queue speculation).

## Thread findings (charts match the captions)
1. Of **210** CI *speed* techniques, **7** are "move to faster runners"; **203** are caching, test selection, sharding, setup, critical path.
2. Top techniques across 10 playbooks (faster runners rank **fifth**): cache deps 9/10, measure test concurrency 9, shard long jobs 8, independent steps in parallel 7, faster runners 6. (Site also lists remove duplicate commands, balance shards, shallow checkout, affected apps, cancel superseded runs, job timeouts, cache large downloads.)
3. Biggest wins from **running less**: Stripe ~5% of Ruby suite per build (median 0.5%); Uber SubmitQueue −53% CI resource usage, −37% wait.
4. **Auto-retries can cost more**: Bun's CI (Anthropic) ~670 retries of timed-out shards across ~200 builds → 465 timed out again, 182 canceled. Fix: retry only when a machine is lost.
5. **Caches can cost more**: OpenAI Codex, 289 release runs — 66,295s saving caches vs 1,515s restoring; they removed the cache step.
6. Scoreboard (before→after as stated): DoorDash build+test 22→6 min; OpenAI median CI ~10→4.5; Shopify Polaris build 65% faster; Spotify image 2h28m→~17 min; Mastra p95 on StarSling 29m56s→5m06s.
7. 253 techniques collapse into **61** `ci-speedup` patterns; skill ranks slowdowns by measured wall-clock from *your* runs (`github.com/starslingdev/skills#ci-speedup`).

Author reply: faster runners are a good first step, but for agent-heavy repos point the agent at the playbooks URL / page prompt.

## Worth keeping (pstack + GHCP software factory)
Coding agents already outrun CI (site line: agents produce changes faster than CI can verify). For Sam's factory the hard gate *is* CI; these playbooks are how that gate stays fast enough to trust.

| Idea | GHCP / pstack move |
|---|---|
| Measure before "optimize" | Builder or dedicated **custom agent** + **skill** pulls recent Actions timings (`gh`); rank by wall-clock critical path, not vibes. Matches pstack "check that can fail" and OpenAI's minutes-saved ranking. |
| Prefer run-less / shard / parallel / cache (when measured) over buying runners | Encode as standing **custom instructions** + optional install of `ci-speedup` / playbooks prompt as a **skill** the coding agent may run. Apply one technique per PR. |
| Selective tests (Stripe/Anthropic/Uber) | Path filters + affected-test selection in workflow YAML; **Agentic Workflows** or normal Actions as the merge gate. Keep full suite somewhere (nightly) so "less" does not mean "blind". |
| Don't blind-retry timeouts; don't blind-cache | Reviewer skill / CI policy: retry only on lost machine; cache only when restore ≫ save (Codex counterexample). |
| Agent iterates one CI metric (Shopify) | Cloud/coding agent loop against a single measured metric, then stop; same shape as poteto verification loops. |
| Overnight CI improvement PRs | **Copilot Automations** / Agentic Workflows propose playbook diffs; human Actions approve merge. StarSling's paid "agents while you sleep" is optional vendor, not required to use the open playbooks/skills. |

**ADO caveat:** library is GitHub Actions-native. On Azure DevOps, steal the *patterns* (selective tests, shard, measure concurrency, critical-path ranking) and re-implement in ADO pipelines; the paste prompts and `ci-speedup` skill expect GHA + `gh`.

## Caveats
- StarSling is selling runners; treat company before/after numbers as their compilation of public sources, not independently re-measured here.
- "253 techniques" vs "210 CI speed techniques" vs "61 patterns": different cuts (speed-only subset vs all); don't conflate.
- Video not watched (~24s). Thread images readable.
- Open skills need python3/PyYAML; `ci-speedup` needs `gh auth`. `sling` talks to StarSling's control plane (credential under `~/.config/sling/`); the audit skills claim local-only.
- Unverified whether every cited company number maps 1:1 to a public PR in the playbook pages without opening each playbook.

## Takeaway
Hand https://starsling.dev/ci-playbooks.md to a GHCP coding agent with the site's safeguards, or install `ci-speedup`, and optimize CI the same way the factory optimizes product code: measure, pick techniques that fit, one commit each, keep required checks. Faster runners are real but rank fifth; the wins that matter for an agent factory are run-less tests, sharding, measured caching, and not paying for useless retries.
