# Lessons from running a software factory (@andrestaltz)

Source: [@andrestaltz, 10 Nov 2026, 20:34 Europe/London](https://x.com/andrestaltz/status/2120253818889768968). André Staltz works at [@SocketSecurity](https://x.com/SocketSecurity) and previously worked on Cycle.js and RxJS. This is a 12-point summary of a talk (numbered 1 to 13, with no point 7). Asked whether the talk is available, he [replied "Nope"](https://x.com/andrestaltz/status/2120259940581507449) to @joanllenas, so this post is the primary source.

## Key lessons

**What it is (1-2).** A software factory is a system of agents that build software, with humans occasionally in the loop. Craft goes into agent instructions and infrastructure rather than into application code. The parts are on-demand agents, scheduled agents (underused), correct instructions (skills and rules), and a correct environment (cloud, infra, connectors).

**Motives (3-4).** Good reasons: less tedious nudging, less slop, more trust. Poor reasons: automate everything as soon as possible, "vibe", or stop looking at code.

**It is programming at a higher layer (5-6).** You debug agent runs, reasoning and tool calls. Natural-language instructions are code, and agent misbehaviour is a bug you own. Point 6 offers historical parallels (von Neumann and assembly, Pascal and Fortran, JavaScript "not real"). Treat that as his framing. The von Neumann anecdote is commonly retold and is not independently verified here.

**Review at the layer you author (8-10).** First list what you actually check in a pull request, then teach an agent to review for those items and invest in its reports. Do not send a dozen models to search for whatever. He now trusts bot reviews more than his own, calling them objective, systematic and auditable, against human review that is subjective, ad hoc and opaque. Prefer writing and reading English, not source code except occasionally: authoring high and reviewing low creates a bottleneck, so invest in a reporting process agents must follow.

**Routine cleanup, then scale carefully (11-13).** Factories can make dead-code deletion, dependency updates and tech-debt pattern removal routine. Narrow each agent with guardrails (rules, linting) and fail closed. Agents must not hack around constraints. A missing or broken environment is a bug: the agent should fail, and you should fix the environment. Premature automation is, in his words, the root of all evil. Get agents correct in a correct environment with narrow goals, then scale gradually and keep monitoring.

## What checks out, and caveats

These are self-reported opinions from one practitioner. There is no talk recording to check, and the post gives no throughput, cost or defect numbers. Point 9's "objective" claim is contested in the thread (see below). Nothing here was independently measured.

## Useful replies

@paulopierrondi asked when humans step in, and argued that risky changes often look boring in a diff, so route review by what the change touches, not by size. [@andrestaltz replied](https://x.com/andrestaltz/status/2120258320514564256) with two mechanisms: random human review of about 10% of pull requests, to check that the reviewer bot is reviewing correctly; and a risk score from the bot's findings, where a good score can mean an easy or automatic merge and a bad score requires a human.

@jatingargiitk pushed back on point 9: auditability lets you trace a mistake, but consistency is not objectivity. He wants a second check that was not taught the same checklist.

@johnroodepic warned that cleanup runs make decisions nothing remembers, so a later agent can re-add a removed dependency (and plugged his product, memoryrouter). [@andrestaltz replied](https://x.com/andrestaltz/status/2120272135029698838) that factories can have memory, and cleanup tasks can bail out if there is nothing to clean.

@hey_its_pc described scheduled agents that start from error logs, reproduce, open a fix pull request, and wait for a human to approve, as a plug for lemma. Treat that product claim as unverified vendor promotion.

## GHCP mapping

This is a proposed port onto GitHub Copilot, not a feature of the talk.

Use [GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-github-agentic-workflows) (`gh-aw`) on a [schedule](https://github.github.com/gh-aw/reference/schedule-syntax/) for dead code, dependency bumps and recurring tech-debt patterns. Keep the agent read-only and declare [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/) such as `create-pull-request`. When there is nothing to clean, the agent must call `noop`; gh-aw documents this as the usual failure if the run ends with no output.

Put Sam's review checklist into [repository custom instructions](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions): `.github/copilot-instructions.md` for repo-wide rules, and path-specific files under `.github/instructions/` named `*.instructions.md` with an `applyTo` glob. Optionally add a [custom agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents) at `.github/agents/<name>.agent.md`. [Copilot code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review) reads these from the pull request's head branch. By default it leaves a comment review, which does not count toward required approvals unless you enable that setting. The same instructions should require the coding agent to fill a structured pull request report (what changed, why, risk, tests, follow-ups).

The 10% sample and risk score are custom glue, not a built-in Copilot switch. An Actions job can label the pull request and [request reviewers](https://docs.github.com/en/rest/pulls/review-requests); a [ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) or required check can then block merge on a high risk score or on the sampled set. Path-based routing, as @paulopierrondi suggested, belongs in CODEOWNERS or those path-specific instructions, not in diff size.

Fail closed with a correct environment, not with hope. Pre-install tools in [`.github/workflows/copilot-setup-steps.yml`](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment), keep the coding-agent [firewall allowlist](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) tight, and make ruff, mypy, ESLint and `tsc` required checks. Official setup-steps docs say that if a setup step fails, Copilot still starts work in the broken environment, and a firewall block only adds a warning. So instructions must tell the agent to stop and report when the environment is wrong, rather than work around it.

Do not rely on [Copilot Memory](https://docs.github.com/en/copilot/concepts/prompting-and-context/copilot-memory) alone to stop a cleanup agent re-adding a removed dependency. GitHub's own docs say a memory may not apply in every session, and that written custom instructions are the place for rules you need to hold. Keep a reviewed `docs/decisions` log, and tell agents to read it before adding dependencies.

Debug misbehaviour in [agent session logs](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents), which show reasoning and tool calls. Cloud-agent commits also link back to the session.

Related, confirmed in the repo: [deterministic engineering](../poteto-advice/2026-11-06-poteto-deterministic-engineering.md), [smehmood on audit trails and later runs](2026-11-08-smehmood-choreography-over-durable-workflows.md), and [GitHub Agentic Workflows reaching GA](2026-10-30-github-agentic-workflows-ga.md). A kevinkern "Needs you" inbox note was not found on a remote read of `pySam1459/software-factory-notes`.
