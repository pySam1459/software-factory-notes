# @ashpreetbedi: three ways to improve agents (simulations, traces, evaluations)

- Source: https://x.com/ashpreetbedi/status/2116203130266501560 (30 Oct 2026, 16:18 UTC / 16:18 Europe/London). Post body is only the Article link. X Article id `2116176105514184705`, title **3 ways to improve agents: simulations, traces, evaluations**. No replies, no quoted post, no video.
- Author: @ashpreetbedi (Ashpreet Bedi on the profile; building @agnohq). Site: https://www.ashpreetbedi.com/.
- Cover image: `/workspace/ashpreet-imgs/cover.png` — header art "3 ways to improve your agent / Simulations, Traces, Evaluations" with an isometric layered stack illustration (no video).
- Linked build guide in the Article: https://docs.agno.com/agent-platform/first-agent (Daily Brief example; Agno platform).
- Related earlier notes (same improvement shape, different vendors): Ben Holmes self-improvement / benchmarking loops — `2026-10-30-bholmes-factory-two-loops.md`; the 14-point evals list — `/workspace/notes-out/evals/2026-10-29-evals-underrated-skill.md`. Not formal methods.
- Sam's project is on GitHub: GHCP mapping only (no ADO).

## What the Article says
Continuous improvement is still a buzzword; the claim is that the primitives for systems that improve themselves exist, and coding agents are how you drive agent improvement. Three complementary buckets:

1. **Simulations** — a coding agent derives simulations / test cases from the agent definition and recursively improves the agent toward its defined purpose.
2. **Traces and conversations** — a coding agent scans usage data, finds failure modes, and improves from real-world use.
3. **Evaluations** — define evals and hill-climb against them (the "OG" path).

None is strictly better; they work together: simulations explore, traces explain production, evals lock a baseline.

Running example: **Daily Brief** (find news, check sources, short newsletter). Edge cases named: quiet news day; five articles on one announcement; repeating yesterday's news. Building the agent is out of scope here; pointer is the Agno first-agent guide above.

### Improve with simulations
Ask a coding agent to read instructions and tools, construct realistic requests, run them, and judge the response. Useful as soon as an agent exists, before production users.

Agno platform skill called out: `/improve`. Example prompt in the Article:

```bash
/improve daily-brief
```

Simulated user requests; model calls, tools, and storage are real.

### Improve from traces and sessions
Real users ask things simulations miss (incomplete instructions, earlier-conversation references, corrections). Example user line that no simulation would invent: *"This announcement is from last month. Why is it in today's edition?"*

Agno example when production data is available:

```bash
/improve daily-brief using production sessions and traces.
```

Skill reads production sessions/traces; coding agent uses the development environment to run tests against representative fixtures.

### Improve with evaluations
When you find a problem, write a test that catches it again; also write tests for must-get-right behaviour. Prefer checkable expectations ("Only include announcements from the requested period") over vague ones ("Write a good brief").

Agno template skill:

```bash
/create-evals for daily-brief

Check that a quiet day produces a shorter brief,
without old stories or invented dates.
```

### Closing loop
Often use all three on one problem: a reader complaint → investigate/fix → save as an eval → try related situations. Collect conversations, tool calls, results (success and failure), plus agent version and settings, so changes can be re-checked. Coding agents do much of the investigate/test work; humans stay clear on the job, review evidence, and decide what ships.

Summary table from the Article:

| Approach | Start with | Use it to |
|---|---|---|
| Simulations | Intended job and realistic scenarios | Discover weaknesses before production history |
| Traces and sessions | Actual sessions, tool calls, results, feedback | Understand failures that happened in use |
| Evaluations | Repeatable cases with explicit expectations | Compare changes and prevent regressions |

## Worth keeping (GHCP + pstack; GitHub only)

| Idea | GHCP / pstack move |
|---|---|
| Derive probes from the agent’s own instructions | **Skill** (or coding-agent prompt) that reads custom-agent / skill markdown and invents golden-path, edge, tool-selection, and adversarial cases — same shape as Agno `/improve` and as poteto eval playbooks. |
| Run probes against a live harness | Coding/cloud agent with real tools; keep fixtures and session logs in-repo or in accessible storage so the agent can read traces without leaving the environment. |
| Mine production sessions for failures | Export Copilot / agent session traces into a reviewable store; scheduled **Copilot Automation** or **Agentic Workflow** that samples failures and opens skill/instruction PRs (human **Actions** merge). Closest sibling: Holmes Skill Doctor / self-improvement loop. |
| Evals with explicit expectations | Versioned eval suite as a **skill** + CI **Actions** gate; hill-climb only against cases that can fail for real. Aligns with the earlier evals-underrated note (deterministic first, then judges). |
| Human reviews evidence, decides ship | pstack: agents don't grade their own merges; builder ≠ reviewer. Memory holds standing product expectations; custom instructions pin "what good looks like". |
| Collect versioned examples over time | Treat passing/failing traces as the factory's golden set; regenerate when models or skills change. |

For a Copilot-only GitHub factory: you do not need Agno to steal the three-bucket loop. You do need colocated instructions, runnable probes, readable traces, and evals in CI. Agno's `/improve` and `/create-evals` are productised prompts for that loop on their platform.

## Caveats
- Content is from the X Article body (and cover image) fetched via the post; the short post itself has no other text. No thread replies.
- `/improve` and `/create-evals` behaviour beyond what the Article states was not re-verified against Agno source this turn; the first-agent doc confirms Daily Brief as their starter example.
- "Systems improving themselves" is aspirational framing; the concrete mechanism here is a coding agent editing an agent under human ship decisions.
- Not a formal-verification post.

## Takeaway
Improve agents with three complementary loops: simulate from the spec before users exist, mine real traces once they do, and lock fixes as checkable evals. Wire that into GHCP as skills + coding agent probes, Automations/Agentic Workflows that open PRs from failures, CI Actions as the regression gate, and human merge — same pstack idea as Holmes's self-improvement loop and the evals checklist, without needing Agno specifically.
