# GitHub Agentic Workflows GA

- Source: https://x.com/GHchangelog/status/2115477605365252488 (28 Oct 2026, GitHub Universe week)
- Changelog: https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/

## What it is
- Open source project from GitHub Next, now GA. Automation for reasoning tasks (issue triage, CI failure analysis, docs updates, test writing) using coding agents inside GitHub Actions.
- Workflows are written in natural-language Markdown and compiled into standard Actions YAML; reuse existing runners and policies.
- Engine: GitHub Copilot CLI by default (needs a Copilot licence) or bring your own agent; per-workflow model choice and a model router.
- Safeguards: read-only by default, sandboxed container behind the Agent Workflow Firewall, "safe outputs" validation, threat-detection job before changes apply; micro-VM isolation option.
- `gh aw forecast` for AI credit spend; `gh aw add-wizard` for templates; prebuilt workflows in GitHub Next's agentics repo.

## Takeaway: traits in CI
- Natural fit: a PR-triggered Markdown workflow that reads `.agents/traits/*.md` and reviews the diff against them, posting comments via safe outputs.
- Copilot-powered, so it fits a Copilot-only tooling rule.
- Caveat: GitHub Actions only, not Azure DevOps.
- Caveat: an LLM trait check is a soft check. Use it for what lint can't express, and have it propose a lint rule when the same trait keeps being broken (soft rules graduate to hard ones).
