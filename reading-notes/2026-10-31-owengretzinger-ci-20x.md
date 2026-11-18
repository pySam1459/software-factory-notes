# @owengretzinger CI 20x faster (Boardy): clickbait packaging, real playbook

- Source (Sam): https://x.com/owengretzinger/status/2116331367407694118 (@owengretzinger / Owen Gretzinger, head of engineering @boardyai). Europe/London: Fri 31 Oct 2026, 00:48 UTC. Text: “your agent after reading this article watching ci go green in 2 minutes” + 13s video. Quotes the X Article.
- Primary article: https://x.com/owengretzinger/status/2116291924219060319 · Article id https://x.com/i/article/2116240180571172864 · Title: “How I made our CI 20x faster (steal this)”. Europe/London: Thu 30 Oct 2026, 22:11 UTC. ~3.6k bookmarks / ~1.1k likes at fetch. Full body read via public status page (not inventing unread content).
- Author frame: when agents make coding 10× faster, CI is the wait; treated CI as a product; most work via an internal Slack agent from a phone; “give this to your agent.”
- Stack context: Boardy (https://boardy.ai/) NestJS/TypeScript monorepo, Vitest, Nx.
- Related: evals-skills (measure not vibes); Holmes loops; Actions as trust gate in the GHCP factory.

## Verdict (lead)

**Useful for Sam’s GHCP software factory; the Sam post is engagement bait, the article is not empty.** The “20× / 2 minutes / steal this” headline is Boardy’s author-reported before/after, not an independent benchmark, and the bill went from **$230/mo to $4,300/mo**. The techniques themselves (faster runners, Oxlint, bun check / TS7, Vitest `isolate: false`, cache seed from `main`, Nx affected, pre-push hooks, parallel jobs) are real products with primary docs, and several match what Linear published independently. Steal the checklist and the cost mindset; do not paste the headline number into a pitch without measuring your own Actions wall-clock and spend.

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| CI wall-clock **40 min → 2 min** (~20×) | **Author-reported only.** Direction plausible for a previously queue-bound Actions setup; not independently audited. Replies show smaller wins elsewhere (e.g. one reader 4.7 → 3.6 min). | Article table and body; no public Boardy Actions logs. |
| Runners: GH wait **up to 11 min → ~8 s** on Blacksmith | **Plausible / product-backed.** Blacksmith docs: Firecracker boot **under 3 s**, dedicated capacity, drop-in `runs-on`. Boardy’s “8 s” and “11 min queue” are theirs. Label `blacksmith-4vcpu-ubuntu-2204` matches Blacksmith’s naming family (docs also list 2404). | https://www.blacksmith.sh/ · https://docs.blacksmith.sh/blacksmith-runners/overview · pricing https://www.blacksmith.sh/pricing |
| Blacksmith “costs less than GitHub” vs Boardy bill **up ~19×** | **Not a contradiction if volume/size rose.** Blacksmith markets ~2× faster hardware and lower $/min than GH-hosted. Boardy’s $230 → $4,300 is consistent with many more concurrent agent PRs, bigger machines, and sharding, not with Blacksmith being secretly expensive per minute. Author calls it “cheapest money we spend on making agents faster.” | Article “What it costs”; Blacksmith pricing. |
| Oxlint **2 min → 5 s** vs ESLint | **Direction strongly supported; Boardy timings author-only.** Oxc claims **50–100×** vs ESLint on their benches. Repo **oxc-project/oxc** ~23k★, **MIT**, active. | https://oxc.rs/docs/guide/usage/linter · https://github.com/oxc-project/oxc |
| Typecheck: **tsc 70 s → TS7 13 s → bun check &lt;5 s**; local **tsrs 0.6 s** | **Toolchain real; timings author-only.** `microsoft/typescript-go` (TS7 / tsgo) ~26k★, **Apache-2.0**. `bun check` is Bun’s checker (TS7 conformance); Jarred (@jarredsumner) posted **1.7×–7×** faster bun check; Bun **v1.4.4** (22 Oct 2026) ships **1.4×–7.8×** vs 1.4.3. **tsrs** = oxc-project/tsrs (~2.6k★), Rust port of TS7 checker. | https://github.com/microsoft/typescript-go · https://bun.com/docs/runtime/check · https://bun.com/blog/bun-v1.4.4 · https://github.com/oxc-project/tsrs |
| Vitest **`isolate: false`**: shard **100 s → 35 s** | **Technique independently corroborated; risk real.** Linear’s CI write-up calls shared workers their largest single win (~300–379 s → ~195 s on slowest shard) and warns about state leak; they use opt-in + teardown + agent skill updates. Boardy numbers are theirs. | https://linear.app/now/ci-bottleneck-reworked · Vitest isolate docs |
| Cache miss: half of PR runs cold because GH scopes caches to the PR branch; seed from `main` | **Real Actions footgun.** Article’s “all year” / “1% miss after fix” is author audit of 150 runs. | GitHub Actions cache scoping behaviour; article §6 |
| Nx **affected** + nightly full suite; test the skip path | **Real Nx feature; good trap.** Author hid a server change and shards skipped green → they now fail the run if skip is wrong. | Nx affected docs; article §8 |
| Pre-push format/lint/typecheck **&lt;9 s**; prefer hook over AGENTS.md | **Sound agent-ops claim.** Agents skip soft instructions; hooks are constraints. | Article §9; no independent timing |
| Alternatives: “Vercel CI, boat.dev, and a dozen more” | **Partly wrong.** **Vercel CI** exists (Beta, Turborepo-tagged tasks). **boat.dev** today markets **agent sandboxes**, not drop-in GitHub Actions runners; listing it beside Blacksmith as a CI runner is **misleading**. | https://vercel.com/docs/ci · https://boat.dev/ |
| “Give this article to your agent” | **Marketing true enough.** Checklist is agent-actionable; still needs human taste on cost, flake risk, and required checks. | Framing only |

## What is real vs exaggerated vs missing

**Real**
- Third-party Actions runners kill queue time; move *every* job or tiny GH leftovers become the critical path.
- Lint/typecheck tool swaps (Oxlint, bun check / tsgo / tsrs) can collapse multi-minute gates to seconds on TS monorepos.
- Test time is often setup + isolation + wrong parallelism, not “too many tests” (author’s agent found almost nothing to delete among ~20k cases).
- Seed dependency caches from `main`; blobless clone; match concurrency to cores.
- Parallelise lint/typecheck/build/tests; peel side work off the slowest shard.
- Encode gates in **hooks and Actions**, not only AGENTS.md.
- Human merge becomes the next bottleneck once CI is 2 minutes (author’s closing point).

**Exaggerated / easy to misread**
- **“20×”** as a transferable constant. It is Boardy’s stack and previous queue pain. Linear’s public story is much smaller wall-clock change with a large suite growth. Clickbait video on Sam’s link amplifies the number.
- **Cost buried under the speed headline.** Replies correctly fixate on $4,300. Blacksmith’s “cheaper than GitHub” marketing does not mean your bill falls if agents push 20× more.
- **boat.dev** as a peer of Blacksmith for Actions runners.

**Missing / caveats for the factory**
- No open workflow YAML or public Actions run IDs; cannot re-run their numbers.
- `isolate: false` without reset hooks raises flake risk (Linear and thread replies stress this).
- `bun check` / TS7 / Oxlint migration cost (rule gaps, type-aware lint, emit still needs tsc where you need `.d.ts`).
- GitHub Actions **platform fee** on minutes (Blacksmith blog notes control-plane pricing changes) still applies when you leave GH-hosted compute.
- Python side of Sam’s factory is out of scope of this NestJS/Vitest/Nx story; principles (runners, setup audit, hooks) transfer, tools do not.

## Copilot / pstack angle (GitHub only)

| Piece | Fit |
|---|---|
| **Actions** | Highest leverage: runner labels, Oxlint/bun check jobs, cache restore keys from `main`, Nx affected, shard matrix, required checks that fail on bad skips. |
| **Skills / instructions** | “CI is a product”; audit waiting vs setup vs run; prefer pre-push hooks; Vitest shared-worker rules + cleanup in agent skills (as Linear did). |
| **Coding / cloud agent** | Safe to feed the article as a playbook *after* measuring baseline wall-clock and $/mo; forbid blind `isolate: false` without reset hooks. |
| **Evals** | Track CI p50/p95, flake rate, and monthly Actions+runner spend as eval metrics when agents increase push rate. |
| **pstack** | Speeds the trust gate loop; does not replace review, evals, or merge policy. Author’s next bottleneck (“me clicking merge”) is exactly the human overviewer problem. |

## Takeaway

Sam’s instinct (“clickbaity but compelling”) is right on both halves: the video/quote post is bait; the article is a concrete, stealable CI checklist for agent-heavy TypeScript repos, with an honest (and shocking) cost line. For the GHCP factory, implement the free/cheap wins first (cache seed, parallel jobs, Oxlint, typechecker swap, pre-push hook), measure, then decide whether Blacksmith-class runners and heavier sharding are worth a Boardy-scale bill.

## Appendix: @Voxyz_ai CI audit prompt (merged 18 Nov 2026)

This was a separate note, `2026-10-31-voxyz-ci-audit-prompt.md`. It is a remix of this article without credit, so it now lives here.

- Source (Sam): https://x.com/Voxyz_ai/status/2116636332344889391 (@Voxyz_ai / Vox). Europe/London: Sat 31 Oct 2026, 21:00 UTC. Image: before/after CI table. Pasteable "Audit this repo's CI" prompt for Claude Code or Codex.
- Image saved: `reading-notes/voxyz-ci-audit-prompt.png` (table: CI per PR 40 min to 2 min; machine wait 11 min to 8 s; lint 2 min to 5 s; typecheck 70 s to under 5 s; test shard 100 s to 35 s; checkout 36 s to 12 s; install deps 33 s to 13 s).
- No quoted post; no link to the original article. Replies are mostly engagement echo; none from Vox naming a source.
- Primary origin (already noted): @owengretzinger X Article "How I made our CI 20x faster (steal this)" https://x.com/owengretzinger/status/2116291924219060319 (Boardy). Full claims check is the main body of this note.

### Verdict (lead)

**Useful prompt; dishonest packaging.** The 40 min to 2 min story, the 150-run queue/setup/run split, the year-old dependency-cache miss on half the test jobs, and the nine checklist items are lifted from @owengretzinger's Boardy write-up. @Voxyz_ai never names Boardy, Blacksmith, Oxlint, bun check, Vitest, or Nx, and never links the article. Steal the **audit prompt** (report first, change nothing) and treat the big numbers as **Boardy's author-reported result**, not as Vox's measured win. For the full playbook and cost line ($230/mo to $4,300/mo), use the main body of this note, not this post.

### Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| "Nine changes" cut CI from up to 40 min to 2 | **Boardy's numbers, unattributed.** Same headline as Owen's article. Not independently audited; not Vox's repo. | Owen article table; existing note |
| Agent pulled last 150 CI runs; split wait / setup / run; half of test jobs missed dependency cache for a year | **Same anecdote as Boardy §6.** Real Actions footgun (PR-scoped caches with no seed from `main`). "Year" and "half" are author audit claims. | Owen article; GH Actions cache scoping |
| Image timings (machine wait 11 min to 8 s, lint 2 min to 5 s, typecheck 70 s to under 5 s, shard 100 s to 35 s, checkout 36 to 12, install 33 to 13) | **Match Owen's article row-for-row.** | Owen article + Vox image |
| Prompt's nine checks map to real CI levers | **Yes, and they match Owen's nine sections** (runners, lint, typecheck, sharding/size, isolate/reload, setup/cache/blobless/cores, parallel jobs, affected-only, pre-push). Direction supported by Linear's CI write-up and product docs; see Owen note for primary links. | Prompt text vs Owen §§1 to 9 |
| Implies Vox (or "you") achieved 40 to 2 | **Misleading by omission.** First person absent, but no credit either. Engagement replies treat it as Vox's result. | Post body; thread |
| Cost of the win | **Missing here.** Owen reports CI bill $230/mo to $4,300/mo. | Owen "What it costs" |

### What to steal vs skip

**Steal**
- The pasteable audit prompt: `gh` last 150 runs; split queue vs setup vs run; check the nine items; for each problem give seconds cost, file:line, rough save; separate money/risk changes; **report first, change nothing**.
- Habit: measure before patching workflow YAML (reply from @anonvibecoder asked whether agents edit YAML after; good human gate).

**Skip / caveats**
- Do not cite "Vox cut CI 20x". Cite Boardy / @owengretzinger, or measure your own Actions wall-clock.
- Do not apply `isolate: false`, smaller suites, or paid runners from the prompt alone; Owen note covers flake and bill risk.
- cancel-in-progress on branch concurrency (@mehdidotnet reply) is a separate, sound tip when agents push every few minutes; not in Vox's prompt.

### GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills / instructions** | Add a `ci-audit` skill that embeds this prompt (or Owen's fuller checklist), requires a written report artifact, and forbids workflow edits until a human says go. |
| **Coding agent / cloud agent** | Safe first job: run the audit with `gh`, open a draft issue or PR comment with the report. Second job only after approval: patch Actions YAML, cache keys from `main`, pre-push hook. |
| **Actions** | Highest leverage once measured: runner choice, cache seed, parallel jobs, affected filters, required checks that fail on bad skips. Track p50/p95 wall-clock and $/mo as eval metrics. |
| **Agentic Workflows** | Optional scheduled workflow: weekly CI time report from last N runs (same three-way split). |
| **Custom agents** | Optional "CI product owner" agent whose only job is audit reports and proposed diffs, never silent merges. |
| **Memory** | Store baseline timings and the factory's chosen runner/lint/typecheck stack so agents do not rediscover the same footguns. |
| **pstack** | Matches verify-before-change: report first. Speeds the trust gate; does not replace review or merge policy (Owen's next bottleneck was human merge). |

### Takeaway

A copy-paste CI audit prompt wrapped around someone else's before/after table. For Sam's factory: keep the prompt as a skill, keep attribution and the cost warning from the Owen/Boardy note, measure your own Actions before buying faster runners.
