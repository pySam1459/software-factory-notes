# Software factory notes

Sam's (@samthellm) personal notes on building an AI-agent software factory on the GitHub Copilot stack (custom agents, skills, instructions, hooks, the coding agent, Agentic Workflows, Copilot Memory and Actions), based on @poteto's pstack. The target is a Python backend and TypeScript frontend on GitHub.

The notes collect @poteto's advice, guides for making a codebase safe for agents, reading notes on posts, talks and articles, agent UX references and formal methods. Each note checks claims against primary sources and ends with how it maps onto the Copilot stack.

## Folder guide

| Folder | What goes there |
|---|---|
| [ai-friendly-environments/](ai-friendly-environments/README.md) | Evergreen how-to guides (principles, TypeScript, React, Python, lint, tests, hooks, traits, instructions), with runnable examples, scripts and Copilot skills. Written first for a legacy ADO repo; the ideas carry over. |
| [poteto-advice/](poteto-advice/README.md) | Everything by or about @poteto and pstack: a compilation by theme, dated notes, and raw transcripts and X posts in `raw/`. |
| [reading-notes/](reading-notes/README.md) | Dated notes on other people's posts, talks and articles. The default home for a new note. |
| [ux/](ux/README.md) | Agent UI references, with stills in `ux/agent-components/`. |
| [formal-verification/](formal-verification/README.md) | Proving code correct rather than only testing it. |
| [agent-design/](agent-design/README.md) | Sam's own bot and orchestration design research. |
| [archive/](archive/README.md) | Off-topic or time-bound notes, kept with the reason they were archived. |
| [templates/](templates/note.md) | The note template. |

## Adding a note

Copy [templates/note.md](templates/note.md). Name the file `YYYY-MM-DD-handle-slug.md`, fill in the front matter (title, date, source, author, tags, status), keep the closing `## Copilot mapping` heading, and add a one-line entry to the folder README. Older notes predate the template and use other closing headings (for example "GHCP mapping" or "Takeaway").

## How to search

- Everything on a topic: `git grep -n -i "verification" -- . ':!poteto-advice/raw'`. The raw @poteto posts and transcripts are large and swamp most searches, so exclude them unless you want her exact words.
- On GitHub code search: `repo:pySam1459/software-factory-notes verification -path:poteto-advice/raw`.
- Copilot decisions: `git grep -n -E "^## (Copilot mapping|GHCP)"` finds the mapping section in most notes.
- By person: file names carry the X handle, for example `git ls-files | grep -i poteto`.
- By date: file names start with the date of the source.
- Each folder README has a one-line summary per note, which is the quickest way to scan a folder.

## Where to start

- [All code is slop (except mine) (@poteto)](poteto-advice/2026-11-11-poteto-all-code-is-slop.md): the latest version of the poteto pyramid (codebase, static analysis, verification, prose, human review).
- [Core principles](poteto-advice/compilation/core-principles.md) and [Tooling](poteto-advice/compilation/tooling.md): @poteto's advice compiled by theme.
- [Principles](ai-friendly-environments/principles.md): turning rules into checks, the ratchet, and the rule table.
- [What a software factory actually is (@mardehaym)](reading-notes/2026-11-16-mardehaym-software-factory-10-parts.md): a ten-part checklist and the vendor test against an all-in GHCP stack.

## Index of notes

### poteto-advice

- [The Rise Of AI Coworkers, Lightcone episode (@poteto)](poteto-advice/2026-11-14-poteto-lightcone-ai-coworkers.md)
- [All code is slop (except mine) (@poteto)](poteto-advice/2026-11-11-poteto-all-code-is-slop.md)
- [Find state machines, check their rules, then show the flows (@poteto)](poteto-advice/2026-11-08-poteto-formal-verification-statecharts.md)
- [Deterministic engineering over "software factory" (@poteto)](poteto-advice/2026-11-06-poteto-deterministic-engineering.md)
- [@_nogu66 on `/automate-me` (vs `/poteto-mode`)](poteto-advice/2026-11-03-_nogu66-pstack-automate-me.md)
- [poteto: short Grok Bot guide for a high-quality bot team (31 Oct 2026)](poteto-advice/2026-10-31-grok-bot-team-guide.md)

Compilation:

- [Core principles](poteto-advice/compilation/core-principles.md)
- [Tooling: pstack, verification and agents](poteto-advice/compilation/tooling.md)
- [Tips from poteto's X posts (14 Sep – 26 Oct 2026)](poteto-advice/compilation/tips-from-posts.md)
- [Applying it at Microsoft (Copilot, ADO, large legacy codebase)](poteto-advice/compilation/applying-at-microsoft.md)
- [How poteto (Lauren Tan) structures her Grok Bots](poteto-advice/compilation/multi-bot-setup.md)

Raw sources: [transcripts](poteto-advice/raw/transcripts/README.md), [X posts](poteto-advice/raw/x-posts/README.md), [pstack](poteto-advice/raw/pstack/README.md).

### ai-friendly-environments

- [Principles](ai-friendly-environments/principles.md)
- [TypeScript strictness](ai-friendly-environments/typescript-strictness.md)
- [React: banning `useEffect`](ai-friendly-environments/react.md)
- [Python](ai-friendly-environments/python.md)
- [Banning comments](ai-friendly-environments/comments.md)
- [Lint rules and the ratchet](ai-friendly-environments/lint-rules.md)
- [Tests that agents can't game](ai-friendly-environments/tests.md)
- [Hooks and scripts](ai-friendly-environments/hooks-and-scripts.md)
- [Agent config hygiene](ai-friendly-environments/agent-config-hygiene.md)
- [Traits (trait-driven development)](ai-friendly-environments/traits.md)
- [/retro skill paper (@mattpocockuk)](ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md)
- [Agent-first CI wishlist (@dodeja)](ai-friendly-environments/2026-11-03-dodeja-agent-first-ci-wishlist.md)
- Copilot skills: [/correct](ai-friendly-environments/copilot-skills/correct/SKILL.md), [/check-traits](ai-friendly-environments/copilot-skills/check-traits/SKILL.md); [example traits](ai-friendly-environments/examples/traits/README.md); [Python example project](ai-friendly-environments/examples/python/)

### reading-notes (by theme)

#### Factory design and lessons

- [What a software factory actually is (@mardehaym)](reading-notes/2026-11-16-mardehaym-software-factory-10-parts.md)
- [Lessons from running a software factory (@andrestaltz)](reading-notes/2026-11-10-andrestaltz-software-factory-lessons.md)
- [Software factory as signal-to-ship control loop (@EnoReyes)](reading-notes/2026-11-06-EnoReyes-software-factory-diagram.md)
- [Latent Space factory stack walkthrough (@zachlloydtweets × @swyx)](reading-notes/2026-11-05-zachlloydtweets-swyx-factory-stack.md)
- [Don't vibe code your software factory (@zachlloydtweets)](reading-notes/2026-11-04-zachlloydtweets-dont-vibe-code-your-factory.md)
- [karpathy HackerTube](reading-notes/2026-11-01-karpathy-hackertube.md)
- [Ben Holmes: self-improvement and benchmarking loops for a software factory](reading-notes/2026-10-30-bholmes-factory-two-loops.md)
- [Ondrej's build, review, ship agent loop](reading-notes/2026-10-29-ondrej-build-review-ship.md)
- [Harness, Loops, Graphs](reading-notes/2026-10-28-harness-loops-graphs.md)
- [A factory with zero reverts](reading-notes/2026-10-28-factory-zero-reverts.md)
- [Cheap code, precious trust](reading-notes/2026-10-26-cheap-code-precious-trust.md)

#### Codebase rules and agent instructions

- [Folder setup that is meant to stop lazy "fixed" claims (@bebuu_ai)](reading-notes/2026-11-11-bebuu_ai-claude-harness.md)
- [Tw93's 20 AI coding rules](reading-notes/2026-10-29-tw93-ai-coding-rules.md)
- [Maze: codebase slop indicators](reading-notes/2026-10-29-maze-codebase-slop-indicators.md)
- [Ban useState, use useReducer](reading-notes/2026-10-28-ban-usestate-usereducer.md)
- [Bun's CLAUDE.md](reading-notes/2026-10-27-bun-claude-md.md)

#### Skills, plugins and multi-agent patterns

- [Make agents complain about the codebase (@kentcdodds)](reading-notes/2026-11-15-kentcdodds-agents-complain.md)
- [UI hill climb with a model council (@kaelig, after @theo)](reading-notes/2026-11-05-kaelig-ui-hill-climb-council.md)
- [Dependabot adds APM version updates (@OrenMe)](reading-notes/2026-11-03-OrenMe-apm-dependabot.md)
- [KacperRutk: Dr Eggbot plus /grill-me](reading-notes/2026-10-31-kacperrutk-eggbot-grill-me.md)
- [Elephant-Goldfish Model (EGM)](reading-notes/2026-10-31-elephant-goldfish-model.md)
- [pstack panels and tstack council: multi-agent comparison burns tokens](reading-notes/2026-10-30-pstack-panel-token-cost.md)
- [pstack: plugin vs copied skills](reading-notes/2026-10-28-pstack-plugin-vs-copied-skills.md)
- [poteto (Lauren Tan) workshop: trust, verification and hard constraints](reading-notes/2026-10-28-poteto-agent-team-workshop.md)
- [Theo's tstack skills](reading-notes/2026-10-26-theo-tstack-skills.md)

#### Verification, evals and review

- [Three levers to cut review time on agent PRs (@BHolmesDev)](reading-notes/2026-11-13-BHolmesDev-three-review-levers.md)
- [Ray Amjad on Claude Code verifiers](reading-notes/2026-11-01-ray-amjad-claude-code-verifiers.md)
- [luhsnaa agent evals map](reading-notes/2026-11-01-luhsnaa-agent-evals.md)
- [evals-skills by Shreya Shankar and Hamel Husain](reading-notes/2026-10-30-evals-skills.md)
- [@ashpreetbedi: three ways to improve agents](reading-notes/2026-10-30-ashpreetbedi-simulations-traces-evals.md)
- [Evals are the most underrated skill](reading-notes/2026-10-29-evals-underrated-skill.md)

#### CI speed and cost

- [A prompt to get CI under two minutes (@pontusab)](reading-notes/2026-11-15-pontusab-ci-under-2-minutes.md)
- [CI and sandbox costs (@CalvinGrunewald)](reading-notes/2026-11-07-CalvinGrunewald-ci-sandbox-costs.md)
- [GitHub Actions rounds every job up to a whole minute (@DanielLockyer)](reading-notes/2026-11-02-daniellockyer-actions-minute-rounding.md)
- [owengretzinger CI 20x](reading-notes/2026-10-31-owengretzinger-ci-20x.md)
- [StarSling CI Playbooks](reading-notes/2026-10-30-starsling-ci-playbooks.md)

#### Platform, always-on agents and tools

- [Programmatic tool calling is a layer on MCP, not a replacement](reading-notes/2026-11-20-programmatic-tool-calling.md)
- [Always-on agents sleep between short runs (@TekonBurns)](reading-notes/2026-11-13-TekonBurns-always-on-agents.md)
- [One account per agent, and what that does not fix (@berman66)](reading-notes/2026-11-11-berman66-agent-identity.md)
- [MCP or CLI? Yes. (@zeeg)](reading-notes/2026-11-10-zeeg-mcp-or-cli.md)
- [Long-lived data, short-lived code (@smehmood)](reading-notes/2026-11-08-smehmood-choreography-over-durable-workflows.md)
- [agent-browser compact browser CLI (@blob16exe)](reading-notes/2026-11-08-blob16exe-agent-browser.md)
- [dave_deguzza Playwright Chromium cleanup](reading-notes/2026-11-03-dave_deguzza-playwright-chromium-cleanup.md)
- [DeepSeekHarness super-agent design](reading-notes/2026-11-01-deepseekharness-super-agent-design.md)
- [TiagerBao on Microsoft Agent Framework](reading-notes/2026-10-31-tiagerbao-ms-agent-framework.md)
- [d4m1n hyping vercel-labs/agent-desktop](reading-notes/2026-10-31-d4m1n-agent-desktop.md)
- [GitHub Agentic Workflows generally available](reading-notes/2026-10-30-github-agentic-workflows-ga.md)

#### UI resources

- [thenowhereway UI sites](reading-notes/2026-10-31-thenowhereway-ui-sites.md)

### ux

- [Needs-you decision inbox (@kevinkern)](ux/2026-11-08-kevinkern-needs-you-inbox.md)
- [@nizamdesign: Fixora maintenance ops dashboard (dark and light)](ux/2026-11-03-nizamdesign-fixora-dashboard.md)
- [@jubayer6910: Auton agent approvals flow](ux/2026-11-02-jubayer6910-auton-approvals.md)
- [@iliasconfidency: replay the last 90 days before a limit change](ux/2026-11-02-iliasconfidency-limit-change-replay.md)
- [@iliasconfidency CarePath: show your work on extracted fields](ux/2026-11-02-iliasconfidency-carepath-show-your-work.md)
- [@iliasconfidency: agents and policies, activity log with undo](ux/2026-11-02-iliasconfidency-agent-activity-undo.md)
- [@flohoeller Agent Fleet: every agent and its sub-agents in one view](ux/2026-11-02-flohoeller-agent-fleet.md)
- [@afomera Maple Factory: software-factory UI with proof-before-merge](ux/2026-11-02-afomera-maple-factory.md)
- [@odysseus0z: personal agents converge; attention + generative UI next](ux/2026-11-01-odysseus0z-attention-bottleneck-gen-ui.md)
- [Good design vs AI-slop design (rules for agent-generated UI)](ux/2026-10-31-good-design-vs-ai-slop.md)
- [Agent component gallery](ux/agent-components/README.md)

### formal-verification

- [Lean 4 derived C for the $12 server](formal-verification/2026-10-30-lean-twelve-dollar-server.md)
- Related: [@poteto on state machines and statecharts](poteto-advice/2026-11-08-poteto-formal-verification-statecharts.md), [Cheap code, precious trust (@msdev)](reading-notes/2026-10-26-cheap-code-precious-trust.md)

### agent-design

- [Decision models (researched 27 Oct 2026)](agent-design/decision-models.md)
- [Cursor Agent SDK vs GitHub Copilot SDK (researched 26 Oct 2026)](agent-design/cursor-agent-sdk.md)

### archive

See [archive/README.md](archive/README.md) for the five archived notes and why each was archived.

## How this repo is updated

This is a notes repo. Changes are committed straight to `main`.
