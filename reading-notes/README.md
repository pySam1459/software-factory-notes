# Reading notes

Short notes on interesting posts and articles Sam has shared.

Each file is named `YYYY-MM-DD-slug.md`, using the date of the post.

## Index

- [Ondrej's build, review, ship agent loop](2026-10-29-ondrej-build-review-ship.md): David Ondrej's three-phase agent flowchart (reproduce, independent read-only review, severity filter, re-review, post-merge loops), mapped to GitHub Copilot agents, skills, Automations, Memory and Actions plus pstack.
- [Pages as project management (not chats)](2026-10-29-pages-as-project-management.md): Fenech's Grok Bot playbook of one Page per project, a master index, bots that read first and update last, and a weekday heartbeat; try one project for 7 days and watch usage.
- [Code-driven launch videos (Remotion / HyperFrames)](2026-10-29-code-driven-launch-videos.md): how the T3 Tots launch clip was likely made; agents write React or HTML compositions and render them headlessly to MP4; Remotion needs a company licence at 4+ people, HyperFrames is Apache 2.0.
- [Tw93's 20 AI coding rules](2026-10-29-tw93-ai-coding-rules.md): English version of his Chinese list (plus the blog's 21st harness/Waza rule); keep the verification, risk-tier and writer-not-reviewer bits, skip the cheerleading.
- [Evals are the most underrated skill](2026-10-29-evals-underrated-skill.md): 14-point eval playbook (error analysis, goldens, deterministic checks, trajectory/pass^k, CI gates); mchulet link is a repost of @divaagurlxw's list.
- [Harness, Loops, Graphs](2026-10-28-harness-loops-graphs.md): m4lkxx's seven-level ladder from chat to self-improving agent systems, quoted by another repost of poteto's live session; gate on cost of undo, not confidence.
- [GitHub Agentic Workflows GA](2026-10-28-github-agentic-workflows-ga.md): Markdown-defined agent workflows compiled to Actions, now GA; a natural home for checking traits in CI.
- [Ban useState, use useReducer](2026-10-28-ban-usestate-usereducer.md): Matt Pocock and hot_town on banning useState so agents take one explicit state path.
- [A factory with zero reverts](2026-10-28-factory-zero-reverts.md): Tanveer Gill's 453 PRs, 0 reverts, three rules, plus his "software factory from zero" roundup.
- [Matt Pocock's software factory course](2026-10-28-matt-pocock-factory-course.md): paid course from 9 Nov; the free skills, Sandcastle and articles that cover the same ground.
- [pstack: plugin vs copied skills](2026-10-28-pstack-plugin-vs-copied-skills.md): Melkey asks poteto why pstack ships as a plugin rather than copyable skills like Theo's tstack; poteto: easier to distribute and update, and the skills are meant to be composed.
- [poteto (Lauren Tan) workshop: trust, verification and hard constraints](2026-10-28-poteto-agent-team-workshop.md): trust vs number of agents; verification skills so you are not the bottleneck; hard constraints (lint, CI, Dune) beat soft rules.
- [Bun's CLAUDE.md](2026-10-27-bun-claude-md.md): Bun's CLAUDE.md: agent guide for a huge Rust/C++ codebase, incl. its sharp rules on code comments and proving tests fail before the fix.
- [Theo's tstack skills](2026-10-26-theo-tstack-skills.md): Theo's tstack: his everyday Claude Code/Codex skills for the PR lifecycle (full-send, council, sol-loop, file-pr and more).
- [Cheap code, precious trust](2026-10-26-cheap-code-precious-trust.md): generating code is now the easy part; the hard part is trusting it.
