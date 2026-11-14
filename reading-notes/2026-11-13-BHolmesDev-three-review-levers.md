# Three levers to cut review time on agent PRs (@BHolmesDev)

Source: [@BHolmesDev, 13 Nov 2026, 15:00 Europe/London](https://x.com/BHolmesDev/status/2121256836703895578). He is "Factory Foreman" at Warp. The post is advice for teams "buried under 10, 100, 1000 agent PRs to review." He later replied to [@weswinham](https://x.com/BHolmesDev/status/2121319773363724662) that Warp had open-sourced a skill for lever 3, linking [warp.dev/merge-risk](https://www.warp.dev/merge-risk). Treat the marketing page (Factories, computer use, and an unsourced "Warp Customer" quote) as product copy, not as a description of the skill.

## The three levers

1. Run rounds of adversarial code review with your own review agent before a human looks.
2. Verify user flows end-to-end with simulated environments, computer use, and automated checks.
3. Score and mitigate merge risk on every PR so reviewers know what to focus on.

[@weswinham](https://x.com/weswinham/status/2121276145018569066) said lever 1 was the biggest needle-mover in his experience, and that lever 2 helps for hard-to-test integrations.

## The `/merge-risk` skill

The live skill is in [`warpdotdev/common-skills`](https://github.com/warpdotdev/common-skills), at [`.agents/skills/merge-risk/SKILL.md`](https://github.com/warpdotdev/common-skills/blob/main/.agents/skills/merge-risk/SKILL.md). That directory contains only `SKILL.md` (no scripts). The repository licence is MIT, Copyright (c) 2026 Denver Technologies, Inc. The skill credits Matt Pocock's [`/pr` skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/SKILL.md).

It is an assessment prompt, not a bot that remediates or routes the PR. The published output is a single overall grade (`low`, `medium` or `high`) plus a verdict on each of five dimensions, with short bullets for the gaps that raise risk (file links as needed). The numerical score is kept internal and must not appear in the output. The marketing page says the grade is there "to focus human attention on the most important changes." A sample on that page ends "Review verification before merge." That is a focus hint, not a change to the branch.

The five dimensions, and what counts as low risk:

- **Alignment** (poor / decent / good): the code matches the description and, when present, the source issue. Behaviour assumptions and drive-by changes must be documented.
- **Impact** (large / medium / small): scope is contained and away from sensitive paths. Blast radius includes layout shift, consumer breakages, mobile, and similar. Auth, permissions, payments, PII, secrets, data migrations, dependency bumps, and infra or config carry outsized risk regardless of diff size. Flag anything that widens access, weakens validation, or logs sensitive data.
- **Verification** (poor / decent / good): UX changes need end-to-end proof as screenshots or recordings; performance-affecting changes need profiling. Prefer before-and-after evidence. Missing coverage is a failure. Edge cases must be tested or documented.
- **Rollback cost** (high / medium / low): is the change reversible once merged? The skill distinguishes one-way from two-way doors. Destructive or hard-to-reverse decisions are one-way doors.
- **Error detection** (poor / decent / good / N/A): if this breaks in production, would someone find out before users report it? Look for swallowed errors or fallbacks that hide breakage. Critical flows should be monitored. `N/A` is allowed and is scored as the good, low-risk verdict.

Scoring (internal only). Poor maps to 3, decent to 2, good to 1. Weights: Impact 2, Verification 2, Rollback cost 1.5, Error detection 1, Alignment 1. The score is the weighted average of those verdict scores. Overall grade: low if the score is under 1.5; medium from 1.5 up to but not including 2.25; high at 2.25 or above.

The five names on the Warp page match this file. The page's sample (alignment good, impact small, verification poor, rollback cost low, error detection decent, overall medium) is consistent with verification being both poor and double-weighted.

## What checks out

The post is a process claim, not a measured result. The open-source skill does what the page says on scoring and on listing gaps. It does not "mitigate" merge risk by itself. Warp has not shown that mixing models improves review: when asked, [@BHolmesDev](https://x.com/BHolmesDev/status/2121319983376707798) said it was "worth benchmarking."

## Useful replies

[@harrisonju](https://x.com/harrisonju/status/2121260672847651310) asked whether a review agent shares the writer's blind spots if it uses the same model. [@weswinham](https://x.com/weswinham/status/2121276422962483687) argued for adversarial self-review with a different model (uncorrelated error), plus a third review with a different model in CI. In a follow-up he [self-reported](https://x.com/weswinham/status/2121279742183964728) that the CI reviewer catches something self-review missed 20 to 30 percent of the time, mostly medium severity. Treat that figure as one person's report, not a study. Warp has not published a comparable number.

[@theozdems](https://x.com/theozdems/status/2121324415187026379) said to test the reviewer on seeded bugs first: "Two agents agreeing isn't a test suite; it's a meeting."

[@eyoussef](https://x.com/eyoussef/status/2121351182312452218) would make the agent end every PR with a "not verified" list.

[@drunk_vibecoder](https://x.com/drunk_vibecoder/status/2121364224178114954) would weight reversibility separately from diff size. Reverting code does not restore deleted data.

[@cyberogz](https://x.com/cyberogz/status/2121337037491978269) suggested record/replay of a known-good session against the real system for hard-to-test integrations.

[@custyndev](https://x.com/custyndev/status/2121277958140952619) said to run the risk score in shadow mode for weeks, compare it with what reviewers found, and only then use it for routing. This is a vendor comment (PR triage). [@PhilsInsight](https://x.com/PhilsInsight/status/2121307250753257757) would pair the score with one named reviewer per PR. This is a vendor comment (Nudge).

[@enekes_abel](https://x.com/enekes_abel/status/2121280167079485827) would group the diff by theme or area for reading. [@Hok_Plays](https://x.com/Hok_Plays/status/2121301653110329473) said deterministic end-to-end flow verification is the hardest of the three levers to rely on, because the flows need constant tweaks.

The same caution about not automating a sloppy inner loop is in [All Code Is Slop (Except Mine) (@poteto)](../poteto-advice/2026-11-11-poteto-all-code-is-slop.md) and in the [software-factory lessons (@andrestaltz)](2026-11-10-andrestaltz-software-factory-lessons.md): review at the layer you author, and invest in the review report. A "not verified" list is the same honesty rule as the done-gate in the [@bebuu_ai harness note](2026-11-11-bebuu_ai-claude-harness.md): do not call a change verified if the check was not run. The [@berman66 identity note](2026-11-11-berman66-agent-identity.md) is the related point that a named reviewer agent still needs its own scope, not a shared service account. For the factory framing from the same author, see [Factory, two loops (@BHolmesDev)](2026-10-30-bholmes-factory-two-loops.md).

## GHCP mapping

This is a proposed port onto GitHub Copilot, not a claim that GitHub ships Warp's skill or that mixing models has been shown to help.

**Lever 1: adversarial review before a human looks.** [Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review) can run automatically through a branch ruleset ("Automatically request Copilot code review"), optionally on new pushes and on draft pull requests. You can steer it with [custom instructions](https://docs.github.com/en/copilot/tutorials/customize-code-review): repository-wide `.github/copilot-instructions.md`, path-specific `.github/instructions/**/*.instructions.md`, and `AGENTS.md`. [Model switching is not supported](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review). The product uses a tuned mix of models and prompts, and may use models that are not enabled on the organisation's Copilot Chat model settings. So Copilot code review cannot be the "different model in CI" reviewer @weswinham described.

You can still define a reviewer persona as a [custom agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents) at `.github/agents/*.agent.md`. The [configuration reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration) includes a `model` field that inherits the default if unset. The cloud-agent how-to only spells out setting `model` for IDE profiles (VS Code, JetBrains, Eclipse, Xcode), so do not assume a GitHub.com reviewer agent will run a deliberately different model.

The documented hook for a different-model CI pass is a [GitHub Agentic Workflow](https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/creating-github-agentic-workflows) (`gh aw`). The `on` field accepts the usual Actions triggers, including `pull_request`. The `engine` field defaults to `copilot` and is also documented as supporting `claude`, `codex` and `gemini`. Workflows are [read-only by default](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-github-agentic-workflows); writes go through declared `safe-outputs`. That is a place to run an adversarial review prompt, or the merge-risk skill, without giving the agent a write token.

Before you trust agreement between the authoring agent and the reviewer, follow @theozdems: seed known bugs and measure what the reviewer catches.

**Lever 3: score merge risk, then (later) route.** Compile a `pull_request` agentic workflow that runs the five-dimension rubric and, via [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/), posts the grade with `add-comment` and applies a `merge-risk:low|medium|high` label with `add-labels` (restrict `allowed` to those labels). The skill already tells the agent to keep the numeric score out of the comment. Run this in shadow mode first, as @custyndev suggested: comment and label for weeks, compare with what human reviewers found, and only then consider using the grade for routing. Do not turn the score into a merge gate until that comparison exists.

If you later want a check in the pull request UI, `create-check-run` is also a documented safe-output, and a [ruleset can require status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) before merge. That is a possible later step, not a starting one.

**Lever 2: end-to-end user flows.** For the TypeScript frontend, the Copilot cloud agent's default [Playwright MCP server](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent) can read, interact with, and screenshot pages. By default it can reach only `localhost` or `127.0.0.1` inside the agent's environment, so the app has to be running there. For the Python backend, prefer pytest-based flow tests in CI rather than a browser. @Hok_Plays's caveat still applies: deterministic flow checks drift and need care. @cyberogz's record/replay of a known-good session against the real system is a complement for integrations that are hard to simulate.

**Honesty and reversibility in the PR itself.** Require a "Not verified" section in the pull request template and in the coding-agent / custom-instruction files, so the authoring agent must list what it did not test. Ask the merge-risk workflow to flag reversibility separately from diff size, especially for migrations and data-deletion paths; the skill already treats data migrations as a sensitive area and scores rollback cost as its own dimension, which is the right hook for @drunk_vibecoder's point.

A practical shape: Copilot code review as the always-on first pass (you cannot pick its model); a custom reviewer agent or a different-`engine` agentic workflow as the adversarial pass; a shadow-mode merge-risk workflow that comments and labels; Playwright plus pytest for the flows you can actually keep deterministic; and a human reviewer who can see the grade, the "not verified" list, and the reversibility flag.
