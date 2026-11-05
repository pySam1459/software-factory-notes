# Don't vibe code your software factory (@zachlloydtweets)

Source: [@zachlloydtweets on X, 4 Nov 2026 18:10 UTC](https://x.com/zachlloydtweets/status/2118043142259888383) (founder of Warp / @warpdotdev). X article "Don't vibe code your software factory". About 417 likes, 101 replies, 17 quotes, 943 bookmarks at fetch. Inline images saved alongside this note: [factories stack diagram](2026-11-04-zachlloydtweets-factories-stack.jpg), [factory.yaml sample](2026-11-04-zachlloydtweets-factory-yaml-sample.jpg).

**Vendor content.** This is a Warp Factories pitch dressed as a stack essay. Treat product claims as marketing unless checked against Warp docs. Related earlier note: [Ben Holmes on Warp's two factory loops](2026-10-30-bholmes-factory-two-loops.md).

## What it is

Zach's claim: a software factory is not "a string of prompts tying together cloud agents". Companies that start there regret it because it does not scale. He defines a factory as a measurable, improvable cloud system for scaling coding agents for ROI across an org, and argues it should be treated as **production infrastructure** with a real stack, the same bar you hold for the product you ship.

The article walks four layers: factory-as-code, orchestration, self-improvement and benchmarking, then headless integrations. Closing CTA: talk to Warp about Factories.

## The four layers

### 1. Factory-as-code

Define the whole factory in versioned files: agent prompts, workflows, MCPs, skills, runner config, integrations, automations, measurement, evals and benchmarks. "Terraform for coding-agent workflows." Code unlocks A/B of configs, answers like "can front-end tasks use open-weight models?" and lets agents propose definition changes (the basis of self-improvement).

Warp's format is real and documented, not vapour. Root is `factory.yaml` (`schemaVersion: v1alpha1`) plus a tree of Markdown/YAML:

- `agents/<name>/agent.md` (frontmatter + instructions; roles include FOREMAN, TRIAGE, SPEC, IMPLEMENT, REVIEW, VERIFY)
- `automations/<name>/automation.md` (triggers + prompt)
- `runners/*.yaml`, `routers/*.yaml`, `webhooks/*.yaml`
- `benchmarks/<suite>/suite.yaml` + `tasks/*.yaml`
- `scorers/<name>/scorer.md`
- shared and per-agent `skills/**/SKILL.md`

Hosting: Warp-managed (edits in their web app) or GitHub-backed on a paid plan (merge to the production branch applies the definition). Open examples live in [warpdotdev/warp-factory-examples](https://github.com/warpdotdev/warp-factory-examples). JSON Schemas are published unauthenticated. Docs: [Factory definition syntax](https://docs.warp.dev/factories/factory-as-code), [Factories as Code marketing page](https://www.warp.dev/factories/configuration).

The article's second inline image matches the marketing sample (`web-server-factory` with Sentry MCP, AWS role, Slack + Linear, `agentDefaults.model: auto`). Confirmed by eye against the docs page.

### 2. Orchestration

The layer that reads the definition and moves work through it: spin up sandboxes, route to the right model/harness, prompt per the factory code, persist traces and artifacts, hand off or steer with humans, integrate Sentry/GitHub/Jira/Slack and so on.

Points Zach stresses:

- Agents should get **fewer permissions** and **no secrets** relative to humans on the same remote env.
- Durability and checkpointing matter (he names Temporal as an example approach) so a mid-run crash resumes without duplicating side effects.
- Interactive Slack-style starts need **pre-warmed** sandboxes for latency; automation can trade latency for cost.
- Multi-harness routing (Warp Agent, Codex, Claude Code, internal harnesses) needs a unified experience.

Warp's public orchestration docs cover parent/child spawning, a durable message bus, and factory foreman dispatch ([Multi-agent orchestration](https://docs.warp.dev/platform/orchestration/)). How much Temporal-style durable workflow is under the hood is not spelled out for customers; treat "Temporal" as an analogy, not a confirmed dependency.

### 3. Self-improvement and benchmarking ("factory engineering")

Product engineering ships features through the factory. Factory engineering improves the agent setup for throughput, quality and cost. Foundations: factories-as-code **plus** persistence of agent conversations **and** artifacts (PRs, videos, screenshots), not traces alone.

Tools he lists:

- Online evals / LLM-as-judge scorers on past runs
- Self-improvement agents that propose factory-definition edits from failed scores
- Hermetic task-replay benchmarks (restore tracker + repo state, not naive "ticket already closed" replays)
- Model routing from those results
- Go-forward A/B tests

Warp ships scorers, self-improvement PRs, and benchmark suites in the definition format (see `scorers/`, `benchmarks/`, `selfImprovement` on `factory.yaml`). Related blogs: [engineering self-improving software factories](https://www.warp.dev/blog/engineering-self-improving-software-factories), [LLM-as-a-judge scoring](https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory), [factory benchmarks](https://www.warp.dev/blog/warp-factory-benchmarks), [the factory stack](https://www.warp.dev/blog/the-factory-stack).

### 4. Integrations (headless, API/MCP first)

Work should flow in via Slack, Teams, Jira, Linear, GitHub, GitLab and so on, not through a new "factory web app" with a big prompt box. Factory as headless infrastructure: API and MCP first, usable by humans and by other agents. Cost of that flexibility: routing, per-factory permissions (Slack access is not SRE-factory access), and making each surface feel native.

Docs match the pitch: [Connect your factory](https://docs.warp.dev/factories/connect-your-factory/) lists Slack, Teams, GitHub, GitLab, Azure DevOps, Linear, Jira, custom webhooks, factory endpoints, Factory MCP, direct runs and schedules. Permissions are per factory. [Factory MCP](https://docs.warp.dev/factories/factory-mcp/) is bidirectional (send work in, pull a task out to a local agent, hand it back).

## Sentry crash-triage checklist (useful as a design list)

Even a "simple" crash-triage workflow needs, on Zach's telling:

1. **Integration:** webhook, payload, auth; which workflow fires.
2. **Workflow steps:** triage vs auto-fix; when to loop in a human; whether a spec is required and when; PR author and reviewers; how many review rounds; how correctness is verified (incl. computer use).
3. **Runner:** where it runs; sandbox and toolchain; which repos; which MCPs beyond Sentry and how they auth; forge and tracker access; models/harnesses per step; routing strategy.
4. **Data:** where traces and artifacts land; how you judge cost vs manual triage; how the workflow improves over time.

Warp's own recipe is more conservative than the essay's wishlist: [production incident resolution](https://docs.warp.dev/factories/use-cases/production-incident-resolution/) routes Sentry (or similar) webhooks to foreman + triage for a **read-only** investigation report, then **stops**. Implementation and fix PRs only after an explicit human request. Agents get read-only observability credentials; production writes stay with humans and existing repo controls. Useful pattern for Sam even if you never touch Warp.

## What checks out

| Claim | Verdict | Source |
|---|---|---|
| Factory-as-code with `factory.yaml` + agents/automations/runners/skills/scorers/benchmarks | **Checks out** | [docs.warp.dev/factories/factory-as-code](https://docs.warp.dev/factories/factory-as-code); [warp-factory-examples](https://github.com/warpdotdev/warp-factory-examples); marketing sample matches the article image |
| Headless intake via Slack/Teams/Jira/GitHub etc., not a destination app | **Checks out** as product design | [Connect your factory](https://docs.warp.dev/factories/connect-your-factory/) |
| Scorers, self-improvement, benchmarks in the definition | **Checks out** as shipped file types | Same factory-as-code docs; self-improvement blog |
| Agents should not hold human-grade secrets | **Sound advice**; Warp secrets are managed and injected per run | Factory secrets docs; essay framing |
| Durability "perhaps using Temporal" | **Unverified** for Warp's internals; keep as a design idea | Essay only |
| Pre-warmed sandboxes for interactive latency | **Unverified** depth; plausible ops claim | Essay + general cloud-agent practice |
| "Companies that start with prompt chains regret it" | **Vendor anecdote**; not independently checked | Essay |

Aspirational vs real: the essay's Sentry example reads like a full auto-fix factory. The published Warp recipe is investigate-then-ask-a-human. The file format and integrations are concrete; the "you must buy a full stack or fail" framing is sales.

## Useful replies and quotes

Pushback and useful sharpening (sampled across two reply pages + quote search; many replies are agreement or soft promo):

- **@ChristianHawk** (quote): "Says the CEO selling the agent terminal: prompt chains don't scale, you need real infrastructure. Ideally his." Fair vendor call-out.
- **@gusgonzalezs** asks what a factory unlocks that a small team cannot do today; **@matthew_hartman** answers that for a team of two it is not needed, but he wants one shared pipeline (same config, guardrails, review bar) so time goes to specs and approvals rather than babysitting sessions. He also jokes he is "vibe coding one anyway."
- **@wesleyboland**: do vibe-code a factory and throw it away to learn the hard edges, then rebuild properly.
- **@yoanwaidev**: hash input state (tracker + repo) into the run log next to the config version, or benchmarks quietly compare different tasks.
- **@ragzoi**: naive replay will open a second PR and re-comment unless Slack/Jira/GitHub tools are stubbed.
- **@SilentBytez**: measurement is not verification; an agent that can weaken its own tests gets a free green. Separate verifier.
- **@mvwi**: uneasy about LLM scoring LLM; prefers human-scored training sets as a baseline. Zach replies he likes human scorers as another mechanism.
- **@stas_sorokin_**: ran one ticket with two asks twelve times; one agent dropped the quiet ask seven times. Prompt chains do not catch that.
- **@BennyLam** / **@gagu_sh**: factory = queues, retries, evals, access control, job runner, tests as gate, human merge approval. Agents are workers in that system, not the system.
- **@UtkarshDeoli**: missing piece is durable state (memory, retries, observability), not more orchestration theatre; he runs agents on self-hosted Docker + n8n.

No strong "just use GitHub Actions/Copilot and you are done" reply dominated, but the small-team and "agents are workers under normal engineering gates" threads are the practical counterweight to the full Warp stack pitch.

## GHCP mapping for Sam's factory

Map Zach's four layers onto GitHub Copilot / Agentic Workflows / Actions. Steal the shape; do not assume you need Warp.

### Factory-as-code = `.github/` + APM

| Warp idea | GHCP home |
|---|---|
| Agent definitions | `.github/agents/` custom agents |
| Skills | `.github/skills/` (and APM packages) |
| Standing instructions | `.github/copilot-instructions.md` / instruction files |
| Automations + prompts | Agentic Workflows `.md` files (compile to Actions) |
| Runner / setup | `copilot-setup-steps.yml`, larger Actions runners, custom images |
| MCP config | org/repo MCP allowlists and server config the coding agent can use |
| Lock / version the tree | `apm.yml` + `apm.lock.yaml` with Dependabot `package-ecosystem: apm` (see [./2026-11-03-OrenMe-apm-dependabot.md](./2026-11-03-OrenMe-apm-dependabot.md)) |

**Native:** versioned agents, skills, instructions, Agentic Workflows, setup steps, MCP wiring, APM lockfiles.  
**Build:** a single "factory.yaml" equivalent is just disciplined layout under `.github/` plus APM; there is no one Warp-style apply engine. PR checks that validate agent/workflow YAML are on you (schema + `apm install --frozen` + eval pack).

### Orchestration = Copilot coding agent on Actions

| Warp idea | GHCP home |
|---|---|
| Sandboxed cloud runs | Copilot coding agent on Actions runners; firewall / network controls |
| Fewer perms, no secrets | Copilot environment: keep secrets out of the agent env; humans retain deploy keys |
| Triggers | Agentic Workflows event/schedule triggers; issue/PR labels; `@` mentions where supported |
| Human handoff / steer | PR review, issue comments, required reviewers, branch protection |
| Multi-harness routing | Limited: Copilot model choices + any BYO path you wire yourself; not Warp's multi-harness matrix |

**Native:** coding agent + Actions isolation, firewall story, Agentic Workflow triggers, PR-centric human gates, larger runners.  
**Gaps to build:** Temporal-class durable checkpoint/resume across multi-hour multi-agent jobs; true sandbox pre-warm for interactive latency; first-class multi-harness (Claude Code / Codex / Copilot) under one foreman. For long workflows, compose Actions jobs with explicit state in the repo or an external store rather than hoping the agent session is durable.

### Self-improvement and benchmarking

| Warp idea | GHCP home |
|---|---|
| Persist traces + artifacts | Keep coding-agent session logs and Actions artifacts (patches, screenshots, videos); attach them to the PR or a run record |
| LLM-as-judge online evals | Agentic Workflow that samples failed/merged runs against rubric skills and opens a findings issue/PR |
| Self-improvement agents | Scheduled workflow that proposes skill/instruction diffs as PRs only (human merge). Same shape as Warp Skill Doctor / Ben Holmes loops |
| Hermetic replay | **Build:** freeze repo SHA, fixture tool outputs, and tracker snapshot; stub forge/tracker writes. See reply pushback from @yoanwaidev / @ragzoi |
| Model routing + A/B | **Build:** eval harness over a golden task set; write winners into agent frontmatter or workflow `model:` fields. No native split-test product |

Tie prune/measure to the Treude/Baltes `/retro` study ([../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md)) and keep personal automation modes reviewed ([../poteto-advice/2026-11-03-_nogu66-pstack-automate-me.md](../poteto-advice/2026-11-03-_nogu66-pstack-automate-me.md)). Judge ≠ builder; prefer judges that can open delivered artifacts and CI, not only chat text. For CI speed and agent-first check design, see [../ai-friendly-environments/2026-11-03-dodeja-agent-first-ci-wishlist.md](../ai-friendly-environments/2026-11-03-dodeja-agent-first-ci-wishlist.md).

### Integrations = issues, PRs, Teams, GitHub MCP

| Warp idea | GHCP home |
|---|---|
| Work enters where it already lives | Issues, PRs, GitHub Projects; Teams/Slack bots that open issues or dispatch Agentic Workflows |
| API / MCP first | GitHub MCP server + Actions `workflow_dispatch` / repository_dispatch; avoid a separate factory UI |
| Per-factory permissions | Separate repos or environments per trust boundary (e.g. SRE vs product); CODEOWNERS and environment protection rules |

**Native:** GitHub as the work surface is already how Copilot coding agent works; MCP and Actions cover programmatic entry.  
**Build:** polished Slack/Teams "thinking" UX and cross-tool permission matrices if you need Warp-like polish; start with "bot opens a labeled issue" before inventing a new app.

## Takeaway

Zach is right that prompt chains are a demo and that production factories need versioned config, orchestration with tight agent permissions, persisted traces **and** artifacts, hermetic evals, and intake through tools people already use. Warp Factories is one commercial packing of that stack (`factory.yaml` is real; Temporal/pre-warm depth and "everyone who vibe-coded regrets it" are sales). On GHCP, most of factory-as-code and headless GitHub intake is already native under `.github/`, Agentic Workflows, coding agent, MCP and APM. What Sam still has to build is the factory-engineering loop: hermetic replay with stubbed side effects, durable multi-step checkpointing, model-routing evals and A/B, and human-gated self-improvement PRs. Use the Sentry checklist as a design review for any automation, and prefer investigate-then-ask-human over auto-fix until those loops exist.
