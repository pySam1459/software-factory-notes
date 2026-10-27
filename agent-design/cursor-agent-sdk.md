# Cursor Agent SDK vs GitHub Copilot SDK (researched 26 Oct 2026)

Sources: https://cursor.com/docs/agent-sdk (pages also at .md), npm @grok/agent-sdk v0.3.0 (formerly @cursor/bdk); https://github.com/github/copilot-sdk

## Copilot SDK
The Copilot CLI's agent engine as a library (Python, TS, Go, .NET, Java, Rust). Planning, tool calls, file edits. Triggers, hosting, memory, evals and the Teams front end are yours to build (hence Foundry around it). Fits the team's Copilot-only rule.

## Cursor Agent SDK
Agents as code: a bot/ folder of Markdown + TypeScript; Cursor runs the model loop. Powers Bugbot, Security Review, Approval Bot, Rollouts.
Layout: agent.ts (defineAgent: model, sandbox, tool allowlist, egress, secrets, concurrency), instructions.md, tools/<name>.ts (Zod schema, read/write, approval), skills/, mcp-connections/, host-connections/, subagents/<id>/, channels/, hooks/ (observe-only), schedules/ (cron), reminders/, artifacts.ts, sandbox/workspace/, lib/, evals/*.eval.ts.
Triggers: GitHub, GitLab, Bitbucket, Slack, PagerDuty channels; custom webhooks (defineChannel); cron; reminders; HTTP API; playground. Linear/Jira via webhooks.
CLI: init (templates, --from automation:<url>), dev, run/chat, tool call, validate, info, eval (--junit), deploy, deployment, secret set, logs, session get (trajectory, events, cost).
Evals: t.calledTool, t.notCalledTool, matches (Zod), t.judge.factuality; "hillclimbing" loop: change one thing, rerun, lock wins in with an eval.
Hosting: Cursor-managed (deploy a pushed Git ref) or self-hosted `agent-sdk serve`; model turns still go via Cursor (CURSOR_API_KEY).
Templates: PR reviewer, security-reviewer, thermo-review, triage, pr-autofixer, code-wiki, agents-md, agentic-owners (policies read from base branch).

## Fit for Sam
- Models: Cursor only (default grok-4.5, also composer-2.5); no BYOK or Copilot. Out as engine under Copilot-only rule.
- Teams: no native pack (bundled skill: "No Discord/Teams pack; offer custom webhook").
- Azure DevOps: not mentioned; repo triggers are GitHub/GitLab/Bitbucket only. ADO service hook -> custom webhook is possible but untested.
- Worth borrowing: one file per tool, on-demand skills, evals in CI, policy files committed to the repo.
