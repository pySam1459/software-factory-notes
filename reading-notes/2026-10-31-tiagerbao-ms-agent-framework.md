# @TiagerBao on microsoft/agent-framework: real repo, low fit for Sam’s factory

- Source: https://x.com/TiagerBao/status/2116473163819430294 (@TiagerBao / 旺旺). Europe/London: Sat 31 Oct 2026, 10:11 UTC. Chinese promo post; links https://github.com/microsoft/agent-framework.
- Sam’s take: “curious, but probably not that useful.”
- Folder: **reading-notes/** (awareness only).

## Verdict (lead)

**Agree with Sam: curious, not useful for the GHCP software factory right now.** The linked project is real ([microsoft/agent-framework](https://github.com/microsoft/agent-framework), ~14.4k★ at fetch, **MIT**, Python + .NET, docs at aka.ms/agent-framework). Feature bullets in the post match the README (multi-agent graphs, checkpoint/resume, human-in-the-loop, OpenTelemetry, multi-provider). Adopting MAF would mean a **second agent runtime** beside Grok Bot / GHCP coding agents / pstack skills. That is a platform bet, not a tip to steal. Keep the problem statement (long runs die without checkpoints); do not add MAF to the stack unless you explicitly want Microsoft Foundry-shaped orchestration.

## Claims check (short)

| Claim | Verdict |
|---|---|
| Microsoft open-sourced Agent Framework, >14k★ | **True** (~14,422★). |
| Multi-agent orchestration (serial, parallel, handoff, group) | **Documented** in README “Orchestration Patterns & Workflows”. |
| Checkpoint / resume | **Documented** (checkpointing, restartability, time-travel). |
| Human approval gates | **Documented** (human-in-the-loop). |
| OpenTelemetry observability | **Documented**. |
| Python and .NET, MIT | **True** (Go lives in a sibling repo). |
| “Solves production reliability” | **Marketing.** Framework offers the knobs; reliability still depends on how you use checkpoints and validation (thread replies correctly note resume-on-bad-state risk). |

## GHCP mapping (why low fit)

| Piece | Note |
|---|---|
| **Custom agents / skills / pstack** | Sam already has a harness. MAF is a competing/adjacent SDK, not a drop-in skill. |
| **Agentic Workflows / Actions** | Closer analogue for durable, observable, approval-gated runs **on GitHub**, without taking a Microsoft agent framework dependency. |
| **Memory** | Checkpoint idea is generic; prefer workflow state + artifacts over adopting MAF’s store. |
| **Skip ADO** | Post leans Azure OpenAI / Foundry hosting samples; out of scope for the GitHub-only factory. |

## Takeaway

Bookmark-worthy problem (agent runs that burn half an hour then die). Wrong tool for Sam unless the factory later standardises on MAF/Foundry. Prefer hardening long jobs with Agentic Workflows, Actions checkpoints/artifacts, and verify-before-continue skills already in pstack.
