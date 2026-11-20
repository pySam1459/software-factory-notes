---
title: "Programmatic tool calling is a layer on MCP, not a replacement"
date: 2026-11-20
source: https://blog.cloudflare.com/code-mode/
author: ["Cloudflare", "Anthropic"]
tags: [copilot-platform, skills-and-instructions, guardrails, vendor-pitch, self-reported]
status: current
---

# Programmatic tool calling is a layer on MCP, not a replacement

This is a research note, dated 20 November 2026 Europe/London, on a pattern Sam heard described as "programmatic tool calling" and as a reason MCP is getting outdated. The primary sources are vendor blog posts and docs, so treat product claims and every token figure as self-reported unless a later section says otherwise.

Sources, in date order:

- Cloudflare, [Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode/), 26 September 2025 (14:00 Europe/London). This is the post that names "Code Mode".
- Anthropic, [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/research/code-execution-with-mcp), 4 November 2025.
- Anthropic, [Introducing advanced tool use on the Claude Developer Platform](https://www.anthropic.com/research/advanced-tool-use), 24 November 2025. This is the post that names "Programmatic Tool Calling" as a platform feature, with Tool Search and Tool Use Examples.
- Cloudflare, [Code Mode: give agents an entire API in 1,000 tokens](https://blog.cloudflare.com/code-mode-mcp/), 20 February 2026. A later, server-side Code Mode for the Cloudflare API MCP server, plus an open-sourced Code Mode SDK.
- Cloudflare, [Sandboxing AI agents, 100x faster](https://blog.cloudflare.com/dynamic-workers/), 24 March 2026. Dynamic Worker Loader in open beta, and a recap of Code Mode.

Official docs used for the Anthropic features: [Programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling), [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool), and [Code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool).

## The claim

The version of the claim that circulated (Sam saw it on TikTok) is that classic MCP tool calls are becoming outdated. In the new pattern, services expose tools as a typed API (often a TypeScript interface). The model writes a script that chains those calls. The script runs in a sandbox. Only the final result goes back into the model context, which is said to save a large number of tokens.

Sam thought Cloudflare originated the idea.

## Who coined which term, and when

The idea that an agent should write and run code, rather than emit one structured tool call per step, is older than any of the MCP posts:

- Wang et al., [Executable Code Actions Elicit Better LLM Agents](https://arxiv.org/abs/2402.01030) (CodeAct), arXiv:2402.01030, February 2024 (later at ICML 2024). The paper treats executable Python as the agent's action space.
- Hugging Face, [smolagents](https://huggingface.co/blog/smolagents), 31 December 2024, ships a `CodeAgent` that writes and runs Python to call tools.

What the 2025 and 2026 posts name is the same pattern applied to MCP, plus first-party products around it:

- **Code Mode** is Cloudflare's term, introduced in the 26 September 2025 post. The Agents SDK fetches an MCP server's schema and turns it into a TypeScript API with doc comments taken from the schema. The agent is then given one tool that executes TypeScript. That code runs in a new V8 isolate via the Worker Loader API (later called Dynamic Worker Loader). The isolate has no general internet access: `fetch()` and `connect()` are blocked, or can be proxied, by setting `globalOutbound`. MCP servers are reached through bindings, so tokens stay in the supervisor rather than in the generated script. Early on, the whole generated TypeScript API was loaded into context; Cloudflare already flagged later "search and browse" as future work.
- **Code execution with MCP** is the title of Anthropic's 4 November 2025 engineering post. It presents MCP servers as a TypeScript file tree (for example under `servers/`). The agent discovers tools through the filesystem and loads only the definitions it needs. Anthropic also describes Skills here as folders of reusable instructions, scripts and resources, with a `SKILL.md` added to saved functions.
- **Programmatic Tool Calling** (PTC), **Tool Search Tool**, and **Tool Use Examples** are Anthropic product names from the 24 November 2025 post. The beta header in that launch was `advanced-tool-use-2025-11-20`. Tool search docs use tool versions dated 19 November 2025 (`tool_search_tool_regex_20251119` and `tool_search_tool_bm25_20251119`). Current PTC docs require the code execution tool at version `code_execution_20260120` (20 January 2026) or later, with tools opted in through `allowed_callers`. Claude writes Python that runs in Anthropic's code-execution container; intermediate tool results stay out of the model context. Haiku 4.5 is documented as accepting that code-execution version but not supporting PTC. The current PTC docs also state that tools provided by an MCP connector cannot be called programmatically, so the first-party PTC feature is not a drop-in for every MCP client path.

The 20 February 2026 Cloudflare post still calls the technique Code Mode, but moves it server-side: a Cloudflare API MCP server exports only `search()` and `execute()`, both powered by Code Mode, and runs the generated code in a Dynamic Worker isolate (no filesystem, no environment variables to leak, external fetches disabled by default).

Cloudflare's February 2026 post says Anthropic "independently explored the same pattern". Anthropic's November 2025 advanced-tool-use acknowledgements, written later than Code Mode but earlier than that Cloudflare follow-up, say they "drew inspiration from" Cloudflare's Code Mode and "Code Execution as MCP". Those two wordings do not quite agree. What the dates do show is that Cloudflare published the name Code Mode first, and that neither firm invented "the model writes code that calls tools".

## Token figures (all self-reported)

None of the figures below were re-measured here. They come from the vendors' own posts or docs. Several are also vendor pitches for a product that needs a sandbox you may not already have.

**Cloudflare**

- March 2026 Dynamic Workers post: "simply converting an MCP server into a TypeScript API can cut token usage by 81%." That percentage does not appear as body text in the 26 September 2025 post (it may be in a chart; this note does not treat a chart as a transcribed number).
- 20 February 2026 post, measured with tiktoken, for a Code Mode MCP server covering the Cloudflare API: "around 1,000 tokens" for the two-tool surface; "reduces the number of input tokens used by 99.9%"; "an equivalent MCP server without Code Mode would consume 1.17 million tokens". The post also says the footprint stays fixed no matter how many API endpoints exist (Cloudflare cites over 2,500 endpoints).
- The same March 2026 post says isolates start "around 100x faster" and use "10x-100x" less memory than a typical container. That is a platform claim, not a token claim.

**Anthropic, 4 November 2025**

- A 2-hour sales meeting transcript, if it has to pass through the model twice as an intermediate tool result, "could mean processing an additional 50,000 tokens."
- On loading only the tool definitions needed for the current task: the post says this "reduces the token usage from 150,000 tokens to 2,000 tokens", "a time and cost saving of 98.7%." (The original sentence joins those two clauses with a typographic dash; the figures are quoted here as they appear.) 150,000 to 2,000 is a 98.67% cut, which they round to 98.7%. The 150,000 to 2,000 example is about definitions, not about intermediate results.

**Anthropic, 24 November 2025 (Tool Search and PTC)**

- Points back to the earlier post: tool results and definitions can "sometimes consume 50,000+ tokens before an agent reads a request."
- A five-server example: GitHub 35 tools (~26K tokens), Slack 11 tools (~21K), Sentry 5 (~3K), Grafana 5 (~3K), Splunk 2 (~2K), "approximately 55K tokens before the conversation even starts." Jira is cited as ~17K on its own. "At Anthropic, we've seen tool definitions consume 134K tokens before optimization."
- Tool Search: a worked comparison of all definitions loaded upfront ("~72K tokens for 50+ MCP tools", "~77K tokens before any work begins") versus only the Tool Search Tool upfront (~500 tokens) plus 3 to 5 tools discovered on demand (~3K), for "~8.7K tokens, preserving 95% of context window." The post calls this "an 85% reduction in token usage." It also includes the wording that Tool Search "preserves 191,300 tokens of context compared to 122,800 with Claude's traditional approach." This note does not re-derive that pair of numbers from the 72K / 8.7K example.
- Internal MCP evaluations with Tool Search enabled (self-reported): Opus 4 from 49% to 74%, Opus 4.5 from 79.5% to 88.1%.
- PTC budget example: "reducing consumption from 200KB of raw expense data to just 1KB of results."
- PTC on "complex research tasks": "Average usage dropped from 43,588 to 27,297 tokens, a 37% reduction." Knowledge retrieval is said to have improved from 25.6% to 28.5%, and GIA from 46.5% to 51.2%.

**Anthropic PTC docs (checked 20 November 2026)**

- "On agentic search benchmarks such as BrowseComp and DeepSearchQA ... improved performance by an average of 11 percent while using 24 percent fewer input tokens."
- "Calling 10 tools directly uses roughly 10 times the tokens of calling them programmatically and returning a summary."
- Internal evaluations "on a production Claude model": a 75-tool project-management agent benchmark "reduced billed input tokens by roughly 38 percent with no change in task accuracy." On the tau-squared bench, where each turn makes one or two sequential tool calls, scores were unchanged and cost was "roughly 8 percent more." Production API traffic with 10 to 49 tool definitions sees "typical token savings of 20 to 40 percent."

The docs are more cautious than the launch blog: savings "vary with workload shape", and some workflows cost more.

## What is actually new, and why MCP is not outdated

What is new is not "agents write code." CodeAct and smolagents already did that. What is new is packaging the idea as a layer on MCP, generating a typed API from MCP (or OpenAPI) schemas, running the script in a first-party sandbox, and, later, shipping Tool Search and PTC as platform features.

Both firms still use MCP servers as the source of tools. Cloudflare's September 2025 post is explicit that MCP remains useful because it is a uniform way to connect, authorise and document an API, even when the agent is writing code rather than emitting classic tool-call tokens. The February 2026 follow-up is still "a new MCP server." Anthropic's November 2025 engineering post is about using MCP more efficiently, not replacing it. The TikTok claim that MCP is outdated is hype. This is a better way to *consume* MCP when the tool set or the intermediate data is large, not a successor protocol.

Even Tool Search, on its own, is still classic tool calling once a definition has been loaded. Server-side Code Mode still looks like an MCP server to the client; it just exports two tools and hides the rest behind code that runs on the server. PTC, as documented in late 2026, is closest to "the model writes a script," but it is wired to the code-execution tool and to custom tools with `allowed_callers`, not to Anthropic's MCP connector.

## Trade-offs

You need a code-execution environment. Anthropic's November 2025 post says so directly: a secure sandbox, resource limits and monitoring, and "operational overhead and security considerations that direct tool calls avoid." Cloudflare's answer is a disposable V8 isolate (milliseconds to start, throw away after the script). Anthropic's managed PTC answer is a container that, per current docs, is not eligible for zero data retention or HIPAA, with container data retained for up to 30 days. Isolates are a lighter sandbox than containers, but a sandbox is not the same thing as authorisation. Permissions still have to be enforced in the tool handlers and in whatever policy sits in front of the MCP server. Cloudflare's bindings help by keeping secrets out of the generated code; they do not decide which operation a user meant to allow.

Debuggability is worse than a classic tool trace. Intermediate results never enter the model context, which is the point, but it also means you cannot watch the model reason over each call. Anthropic's PTC docs tell you to log tool calls, check the `caller` field, and test tools independently. A script that fans out 20 lookups is harder to step through than 20 visible tool turns.

Classic tool calls are still better when the work is short and sequential. Anthropic's own "weak fit" list is the right one: each call depends on the model reading the previous result; there are only a few small calls, especially on the first turn, so container and script overhead can exceed the savings; or the tool needs immediate user feedback between calls. The tau-squared bench result (no accuracy gain, about 8% more cost) is the documented warning. User approval of a single side-effecting call is also simpler if that call is a normal tool use, not buried inside a generated script.

A CLI, as in the [@zeeg](2026-11-10-zeeg-mcp-or-cli.md) note, can also keep large payloads off the model's context (for example by writing them to a filesystem). It still needs a shell, and the attack surface is broader than an isolate that can only talk to MCP bindings.

## Related notes

- [MCP or CLI? Yes. (@zeeg)](2026-11-10-zeeg-mcp-or-cli.md): Sentry ships both an MCP server and a CLI, with a filesystem for large traces. That is a different way of stopping huge tool results from filling the window, and it is still MCP rather than a replacement for it.
- [pstack panels and tstack council: multi-agent comparison burns tokens](2026-10-30-pstack-panel-token-cost.md): another self-reported reminder that context and fan-out are where token bills come from.
- [CI and sandbox costs (@CalvinGrunewald)](2026-11-07-CalvinGrunewald-ci-sandbox-costs.md): sandbox and runner cost sits beside model cost, which matters if you add a code-execution environment of your own.
- [One account per agent, and what that does not fix (@berman66)](2026-11-11-berman66-agent-identity.md): a sandbox does not replace short-lived, revocable credentials for the tools the script is allowed to call.
- [pstack: plugin vs copied skills](2026-10-28-pstack-plugin-vs-copied-skills.md) and [Theo's tstack skills](2026-10-26-theo-tstack-skills.md): skills as the place where reusable instructions and scripts live, which is the lighter, human-authored cousin of "code mode."

## Copilot mapping

This is a proposed port, not a claim that GitHub Copilot already has Code Mode or programmatic tool calling. The points below were checked against current GitHub docs on 20 November 2026.

GitHub documents a **GitHub Copilot SDK** (`@github/copilot-sdk`). You can pass `mcpServers` into `createSession` (local stdio or remote HTTP) and, separately, a `sandboxConfig` so sandbox policy is applied before those servers start. That is SDK support for classic MCP and for a local sandbox. It is not documented as schema-to-TypeScript conversion or as model-written orchestration of MCP tools.

**Copilot CLI** can add MCP servers (`/mcp add`, `copilot mcp add`, or the config file). Local sandboxing is turned on with `/sandbox enable` and covers shell commands, file tools, and, by default, local MCP and language servers. [GitHub's sandbox docs](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes) are explicit that remote MCP servers are never sandboxed. CLI also has a `--cloud` option that starts a GitHub-hosted cloud sandbox.

The **Copilot coding agent** can be given MCP servers through repository Copilot MCP settings (JSON; secrets use a `COPILOT_MCP_` prefix). [Environment customisation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) via `copilot-setup-steps.yml` applies to the GitHub Actions-based coding agent, not to cloud-sandbox sessions. The agent already runs inside a GitHub-hosted environment with a firewall you can customise, but GitHub's firewall docs warn that the firewall does not, by itself, restrict MCP-server connections or processes started from `copilot-setup-steps.yml`. MCP here is still the classic "the model calls a tool" path, not Code Mode.

**Skills** are the closest documented GHCP cousin of the pattern. GitHub's [agent skills](https://docs.github.com/en/copilot/concepts/customizations/agent-skills) docs allow a skill directory to hold `SKILL.md` plus scripts, with the instructions telling Copilot how to run them. That is code execution, but the scripts are written in advance by you, not generated each turn to chain MCP calls. Use skills for stable, reviewed workflows (convert this file, run this check, wrap this CLI). Do not treat a skill script as a substitute for a disposable sandbox that can call a large MCP API safely.

There is no GitHub doc, checked for this note, that says the coding agent, Copilot CLI, or the Copilot SDK will convert MCP schemas into a typed API and run a model-written script so that only the summary returns to the model. If you want that on GHCP, you would have to provide the sandbox and the generated API yourself (for example a small MCP server in the style of Cloudflare's later `search()` plus `execute()`, or a skill that wraps a trusted CLI). Until then, classic MCP and skill scripts are the supported tools, and they remain the better default for a handful of short, reviewable calls.
