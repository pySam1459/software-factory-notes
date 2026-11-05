# Latent Space walkthrough of the factory stack (@zachlloydtweets × @swyx)

Source: [@zachlloydtweets on X, 5 Nov 2026 18:30 UTC](https://x.com/zachlloydtweets/status/2118410609234772114): "My chat with @swyx on software factories is live. We walk through the full factory stack." Video: [The 2026 Software Factory Infra Stack  -  Zach Lloyd, Warp.dev](https://www.youtube.com/watch?v=LL0YmIyBKSU) (Latent Space, uploaded 3 Nov 2026, **34m 48s**). Earlier host post: [@latentspacepod](https://x.com/latentspacepod/status/2117721636195663898).

**This note is from the full auto-caption transcript plus a video analysis** (`/workspace/videos/zachlloyd-swyx-factory-analysis.md`), not from the article alone. Sibling article note: [Don't vibe code your software factory](2026-11-04-zachlloydtweets-dont-vibe-code-your-factory.md). Related: [Ben Holmes two factory loops](2026-10-30-bholmes-factory-two-loops.md); [/retro](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md); [UI hill climb / council grading](2026-11-05-kaelig-ui-hill-climb-council.md).

**Vendor content.** Warp Factories demo and hiring CTA. Treat Warp-internal numbers as self-reported.

Demo stills (checked by eye, max 1600px source was 640p stream): [agents board](2026-11-05-zachlloyd-swyx-demo-agents.jpg), [mobile run + artifacts](2026-11-05-zachlloyd-swyx-demo-run-artifacts.jpg), [scorers dashboard](2026-11-05-zachlloyd-swyx-demo-scorers.jpg), [WarpBench cost×correctness](2026-11-05-zachlloyd-swyx-demo-warpbench.jpg).

## What the conversation adds beyond the article

The article argued four layers (factory-as-code, orchestration, self-improvement/benchmarks, headless integrations). The Latent Space episode **shows the product** and adds numbers, fit criteria, and economics.

1. **Live factory UI.** Internal factory `wilson` (plus Marketing Factory), definition in GitHub `warpdotdev/factory-dev`, Agents board with foreman and stage agents (triage, spec, implementation, code-review, design, oncall). Runs show Slack-origin work, PR links, CI, and computer-use screenshots in Artifacts.

2. **Concrete Warp-internal metrics (unverified here).** First factory approach about **$80 per PR** (Opus on triage, too many sub-agents, redundant work) tuned down to about **$15-20 per PR**; throughput **up ~40%** over a month; revert rate not up. About **60%** of Warp's own factory work starts in Slack.

3. **Who should bother.** Zach: overkill for a few people (use Claude Code / Codex subscriptions). Rough floor **5-10 engineers**; sweet spot growth-stage ~10-100 on the "happy stack" (Slack + Linear or Jira). Very large / bespoke shops (he cites Uber and Ramp as build-their-own) will not get plug-and-play. Matches the small-team pushback on the article thread.

4. **Scorers and self-improvement on screen.** Dashboard of LLM-as-judge scorers (redundant tests example; sampling rate to control judge cost). Self-improvement list (~31 items): agents propose factory-definition PRs; example triage needs `spawnableBy` for a research sub-agent after **54** scored failures. Replay-to-prove-the-fix is still a wishlist.

5. **WarpBench.** Replay real company tasks across **models and harnesses** (Warp, Claude Code, Codex, Pi / ACP). Scatter plot correctness vs average cost; on-screen callouts like Sol ~95% at ~$6/trial vs GLM flash ~93% at ~$2 (older model ids; incomplete-score warning on the UI). Results feed routing. Same shape as the article's hermetic benchmarks, but shown as a product surface.

6. **Expanded infra choices.** Compute: Warp uses **Namespace** sandboxes, should stay pluggable (Daytona, Modal, E2B); Mac VMs for iOS computer use. Inference: BYOK / burn existing provider commits. Harnesses: ACP-compatible. Orchestrator is one layer, not the whole platform.

7. **Economics digression (swyx push).** Many small teams rotate **$200 model subscriptions** instead of API; swyx notes those plans can be worth on the order of **$8k** of API (5-50× cheaper). Zach agrees that is the cheapest short path but not scalable and loses central measurement; he does not want Warp Factories to be a token-reseller coding agent (Cursor's path into a model lab as the cautionary tale). **GitHub Copilot is not discussed** by name; GitHub appears as forge and intake.

8. **Roles teaser.** Next AIE talk: **product engineering** (ship through the factory) vs **factory engineering** (engineer the system that builds software). Platform / DevX / eng managers own the measurement UI more than day-to-day feature engineers.

## swyx pushback and useful replies

- Do you need **all** the stack layers, or do Cognition / Cursor style bundles cover enough?
- "Happy stack" naming called out mid-interview.
- Steelman: subscription economics beat a full factory for tiny teams.
- Aside: thought-leading hard enough that people rebuild Warp's shape even if they never buy it.
- X reply to the announce: @anirudh_twt prefers "factory" over "fleet". Little other pushback on that post at fetch time.

## What checks out vs aspirational

| Claim | Verdict |
|---|---|
| Live wilson / scorers / WarpBench / self-improve UI | **Shown on screen** in the episode |
| factory-as-code in GitHub | **Shown** (read-only banner to `warpdotdev/factory-dev`) |
| $80 to $15-20/PR, +40% throughput, 60% Slack | **Self-reported** Warp internals |
| Namespace sandboxes, ACP harnesses | **Stated** by Zach; not independently verified here |
| Auto-replay to validate self-improve PRs | **Not shipped yet** (he says so) |
| "Open source software factory" (swyx intro) | **Loose**: definition files can live in git; platform is Warp's product |

## GHCP mapping for Sam's factory

Steal the **demo loops**, not the Warp UI.

| Episode beat | GHCP move |
|---|---|
| Factory-as-code in git | `.github/agents`, skills, Agentic Workflows, `copilot-setup-steps.yml`, APM lockfile (see article note) |
| Slack / issue to PR with artifacts | Issue/PR labels + Agentic Workflows; store Playwright / computer-use screenshots as Actions artifacts on the PR |
| Scorers dashboard | Scheduled Agentic Workflow: sample merged runs, LLM-as-judge against rubric skills, open a findings issue; sampling rate to cap cost |
| Self-improve PRs to definition | Workflow that proposes skill/agent diffs only; human merge. Prove with hold-out tasks when you can ([/retro](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md)) |
| WarpBench cost×correctness | Build: golden task pack replayed under two Copilot model settings (or second provider if available); chart cost vs pass rate; write winners into agent config. Native GHCP does not ship this matrix |
| 5-10 eng floor / skip if tiny | Same advice as the article thread: do not stand up full factory engineering until shared pipeline pain is real |
| Subs vs API | Prefer subscription quotas for exploration; put factory measurement on runs you already pay for, with hard token budgets |
| Product vs factory engineering | Split custom agents: builders ship features; a separate judge / skill-editor path owns rubrics (same as council / Ben Holmes loops) |

**Native:** GitHub as intake and definition store, coding agent on Actions, artifacts, Agentic Workflows, human review gates.  
**Build:** cost-per-PR accounting, multi-harness matrix, hermetic replay, self-improve-with-proof, Namespace-class sandbox choice. Copilot is not named in the episode; map "central traces + scorers + routing" onto GHCP yourself.

## Takeaway

Same stack story as the article, but with a live wilson demo, Warp-internal cost/throughput claims, a clear "too small / too bespoke" fit filter, on-screen scorers and WarpBench, and an honest digression that $200 model subs still beat a factory for tiny teams. For Sam: keep factory-as-code and GitHub intake on GHCP; invest next in scored loops and a small task-replay matrix before chasing Warp-shaped orchestration.
