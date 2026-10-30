# GitHub Agentic Workflows generally available

- Source: https://x.com/GitHubNext/status/2116220286928585103 (30 Oct 2026, **17:26 Europe/London / GMT**, @GitHubNext). Short post, no media, no video, no quoted post. One public reply (token-scope / audit caution). Changelog it links was published **28 Oct 2026**, so a 30 Oct ~18:00 X digest looking only at that evening's window (or only at X, not the changelog) can miss this; the X announcement itself is mid-afternoon London time, not after 18:00.
- Changelog: https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/
- Docs / CLI: https://github.github.com/gh-aw/ (quickstart: `gh extension install github/gh-aw`). Sample pack: https://github.com/githubnext/agentics. Workshop: https://github.com/githubnext/gh-aw-workshop. ADO twin: https://github.com/githubnext/ado-aw.
- Relation to Ben Holmes / Warp loops post (https://x.com/BHolmesDev/status/2116224247056273893, 17:42 Europe/London same day): **not linked**. Neither quotes or replies to the other. Thematically adjacent (automating agent work around a repo) but different products. See sibling note `2026-10-30-bholmes-factory-two-loops.md`.

## What the post says
GitHub Agentic Workflows (AW) "graduated out of the lab" and is generally available; pitch is automating work that could not be automated before AI. Link only; substance is in the changelog.

## What the changelog / docs say (read)
- Open-source project from GitHub Next. Natural-language **Markdown** workflows (YAML frontmatter) compile into standard **GitHub Actions** YAML, so they reuse runner groups and org policy.
- Engines: default **GitHub Copilot CLI** (needs a Copilot licence); also Claude Code, OpenAI Codex, Google Gemini, Pi (quickstart).
- Example tasks named: issue triage, CI failure analysis, documentation updates, test writing.
- Safeguards called out: integrity filter on GitHub content access; **read-only by default**; sandboxed container behind Agent Workflow Firewall; **safe outputs** validation; dedicated **threat detection** job before changes apply.
- GA additions since public preview (as listed): ARC + Docker-in-Docker; `gh aw forecast` (threat-detection credits + monthly ranges); refreshed models / per-workflow providers / `gh aw add-wizard` templates; model router by task type/difficulty; stronger isolation (Cloud Hypervisor or NVX micro-VM; enclaves for cross-repo leak prevention).
- Availability: github.com for Free, Team, and Enterprise.
- Accenture quote in the changelog (Ben Alton): claimed ~29h/week saved for one lead, team velocity more than doubled, AI authors 91% of commits, production errors ~11,000/day → under 1,000. **Vendor/customer testimonial; not independently verified here.**

Quickstart path read: `gh aw add-wizard githubnext/agentics/repo-status` adds a Daily Repo Status Report that opens an issue; commit both the `.md` source and generated `.lock.yml`. Prefer `pull_request` over `pull_request_target`.

## agentics sample pack (README skimmed)
Maintainer triage (issue triage, Repo Assist, AI moderator), CI Doctor / CI Coach / cost tracker, review bots, loop-engineering links (Autoloop, Goal, Crane), docs updaters, code improvers that report or open PRs, command-triggered `/plan` etc., security scans, and a **Lean Squad** formal-verification workflow. Useful as a menu of chores to hand off; the GA post itself is not a formal-methods announcement.

## ADO angle (separate repo, relevant for Sam)
https://github.com/githubnext/ado-aw — Azure DevOps Agentic Workflows. Same Markdown→pipeline idea: agent stage (sandboxed) → threat detection → SafeOutputs executor with a write token the agent never holds. Installer + `ado-aw init` drops a Copilot agent helper. Worth tracking if the MSFT factory stays on ADO rather than GHA.

## Worth keeping (pstack + GHCP software factory)

| Idea | GHCP / pstack move |
|---|---|
| Markdown chore → compiled Actions workflow | This **is** the product's **Agentic Workflows** surface. Use it for recurring factory chores (triage, CI doctor, docs, test gaps) instead of inventing a portal. |
| Coding agent inside Actions | Same family as the **coding/cloud agent**, but scheduled/event-driven under org runner policy. Pair with **custom agents**/skills for the interactive path. |
| Read-only default + safe outputs + threat job | Encode as standing **custom instructions** / policy: agents propose; write token lives only in the SafeOutputs (or human **Actions**) stage. Matches poteto verification before trust. |
| Sample pack (CI Doctor, test improver, Repo Assist) | Install selectively from agentics; treat each as a skill-shaped playbook, one workflow per concern. |
| Model router / cheaper models per task | Same cost lever as Holmes's benchmark loop: measure, then assign open-weight/cheaper engines to easy chores. |
| ADO twin (ado-aw) | Prefer this compiler if pipelines live in Azure DevOps; do not assume `gh aw` YAML drops straight into ADO. |
| Continuous loops (Autoloop / Goal / Crane, linked from agentics) | Overlap with **Copilot Automations** and with Holmes-style self-improvement cadence; still need human merge gates and frozen evals. |

For the Copilot-only MSFT factory: AW GA is the first-party way to run Copilot (or another engine) on recurring repo chores under Actions policy. Start with read-only / report-only workflows (repo-status, CI Doctor), then graduate to PR-opening improvers once SafeOutputs + threat detection are understood. On ADO, evaluate ado-aw before forcing everything onto github.com Actions.

## Caveats
- X post is a pointer; claims and GA feature list come from the 28 Oct changelog and gh-aw quickstart / agentics README opened this turn.
- Accenture metrics are testimonial.
- Copilot CLI engine needs a Copilot licence; other engines need their own API/auth setup (PAT / org billing / provider keys / WIF as documented).
- `pull_request_target` warning in quickstart is load-bearing; treat as a hard constraint.
- Lean Squad exists in agentics but this note stays in reading-notes/; the announcement is not mainly formal methods.
- Not a reply to or quote of the Ben Holmes Warp loops post the same afternoon.

## Takeaway
Agentic Workflows are GA: write repo automation in Markdown, compile to Actions, run Copilot or another coding agent under read-only-by-default safeguards and safe outputs. For Sam's stack that is the native **Agentic Workflows** / Actions lane for unattended factory chores; use agentics samples carefully, prefer ado-aw if the pipelines are Azure DevOps, and keep human Actions on anything that writes.
