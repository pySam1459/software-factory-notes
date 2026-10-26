# poteto's advice on working with agents

Notes on what Lauren Tan ([@poteto](https://x.com/poteto)) has said about getting agents to do trustworthy work. She has said she shipped about 2,000–2,500 PRs a month this way, and the notes cover the X posts and replies, interviews and talks behind that, plus her pstack plugin. Also covered: how to apply it as a frontend-heavy engineer on the Microsoft Copilot team, where GitHub Copilot is the agent, the repos are on Azure DevOps (ADO), and the codebase is huge and legacy.

Compiled 2026-10-26 by Chief (Sam's Grok Bot). X data runs up to 26 Oct 2026, 08:25 UK time.

**Who she is:** React compiler core team, and she works on Grok Bot at SpaceX AI. She was previously at Cursor, Meta (React team) and Netflix. Her X bio as of 26 Oct reads: "grok @bot at @SpaceXSI. react compiler core team, prev cursor, meta, netflix".

**Conventions:**

- Quotes are verbatim. X posts are lower-case as she writes them, and transcript quotes keep the auto-caption wording.
- **[Chief]** marks Chief's own suggestions, which are not poteto's.
- Ideas from Ron Minsky (Jane Street) are attributed to him.

## Index

### Compilation

| File | Contents |
|---|---|
| [compilation/core-principles.md](compilation/core-principles.md) | The trust bottleneck and verification first, the codebase as memory, the inverse pyramid, context not control, stop the bleeding, banning comments and `useEffect`, feature maps, short skills with evals, readiness metrics, plus Minsky's points |
| [compilation/tooling.md](compilation/tooling.md) | pstack (`/poteto-mode`, `/setup-pstack`, `/correct` in detail, the full skill list), verification skills, Chrome DevTools, Grok Bot and cloud agents |
| [compilation/applying-at-microsoft.md](compilation/applying-at-microsoft.md) | Mapping it onto GitHub Copilot and ADO: skills, instructions, hooks and `preToolUse`; headless Copilot CLI, the ADO MCP server and pipeline schedules; scoping to the folders Sam owns; the `bots/` thin-layer design and diagram |
| [compilation/tips-from-posts.md](compilation/tips-from-posts.md) | Tips and prompts from her X posts, 14 Sep – 26 Oct 2026, by theme |
| [compilation/new-since-2026-10-23.md](compilation/new-since-2026-10-23.md) | What's new between 23 and 26 Oct 2026 |

### Raw material

| Path | Contents |
|---|---|
| [raw/transcripts/](raw/transcripts/README.md) | Four transcripts: the Matt Pocock livestream, the live session with Q&A, the "How I Shipped 2000 PRs" talk, and Ron Minsky's Jane Street talk (which she recommended). Plus Lee Robinson's always-on agents talk as background. |
| [raw/x-posts/](raw/x-posts/README.md) | 989 posts and replies by @poteto from 14 Sep to 26 Oct 2026, as Markdown and JSON, plus Sam's relevant bookmarks |
| [raw/pstack/](raw/pstack/README.md) | `/correct` SKILL.md and the guide's principles chapter, copied under the MIT licence |

The companion repo `../ai-friendly-environments` turns this into concrete config: lint rules, tsconfig, hooks, scripts.

## Sources

**Talks and interviews**

- "How I Shipped 2000 PRs Last Month — Trusting AI Agents" (talk): <https://www.youtube.com/watch?v=NjoZoUm85x0>. She posted the 2,500-PR version on X on 21 Sep: <https://x.com/poteto/status/2102050467505430555>
- Matt Pocock livestream, "Poteto (creator of pstack) on shipping 1,000's of PR's a month at SpaceX": <https://www.youtube.com/watch?v=MN9dGgmLyso>
- Live session with Q&A (chapters on the trust curve, verification, pstack, evals, cloud agents, architecture, CI): `raw/transcripts/live-session-lauren-tan-trust-curve-verification-dune.txt`. The URL was not recorded.
- Ron Minsky, "Now more than ever: building reliable software in the age of agents" (Bug Bash 2026), recommended by poteto on 26 Oct: <https://www.youtube.com/watch?v=rUYP4C29yCw>

**pstack**

- pstack source: <https://github.com/cursor/plugins/tree/main/pstack> (MIT, © 2026 Lauren Tan)
- pstack guide (X article): <https://x.com/poteto/article/2097732320606507506>

**Key X posts**

- Inverse pyramid / "how do you trust your agents' work more?" (16 Oct): <https://x.com/poteto/status/2111133080526495985>
- Verification as the entry point (12 Oct): <https://x.com/poteto/status/2109436202554372476>
- Ban comments (13 Oct): <https://x.com/poteto/status/2110149626133438732>
- pstack principles (14 Oct): <https://x.com/poteto/status/2110496830429839869>
- `/correct` launch (4 Oct): <https://x.com/poteto/status/2106542593656111276>
- Time-to-rewrite (7 Oct): <https://x.com/poteto/status/2107913381751730352>, and the metrics reply: <https://x.com/poteto/status/2107923381001781362>
- `/create-formal-verification-skill` (18 Oct): <https://x.com/poteto/status/2111926622278521253>
- Minsky talk recommendation (26 Oct): <https://x.com/poteto/status/2114626630429913383>
