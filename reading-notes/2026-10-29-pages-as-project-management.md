# Pages as project management (not chats)

- Shared: https://x.com/Michael_Fenech_/status/2115774649598705774 (29 Oct 2026, @Michael_Fenech_ / Michael | AI + Agents; ~60k followers). Long-form note_tweet; attached image is branding only (red-circle face on dotted canvas), not a product screenshot.
- No quoted post, no linked article/repo/product. The "thing" is a **workflow pattern** for Grok Bot teams: use **Pages** (Grok Bot canvases) as the project system of record, and keep chats short and task-scoped.
- Real feature: Pages = the bot's WriteCanvas / Library pages; Routines = scheduled heartbeats. Not open-source, not a third-party product — part of Grok Bot (subject to the owner's plan/usage). Status: published advice from one power user; no independent before/after numbers in the post.

## The setup (from the note)
1. **One Page per project** — goal, status, next actions, owners, deadlines, decisions, blockers, update log (which Bot changed what).
2. **Master index Page** — every active project, status, next action.
3. **Read first, update last** — every Bot reads the project Page before starting and updates it when finished; no duplicate Pages; don't mark complete without checking the actual result.
4. **Short chats** — fresh chat per task; the Page holds history/decisions/context.
5. **Daily heartbeat routine** per project (weekdays) — check email/GitHub/Notion/calendar, verify progress, update Page + index.
6. **Exception reporting** — notify the human only on blocked / overdue / needs decision / status change.
7. **Project closure** — mark Closed, record outcome + lessons, pause the heartbeat.
8. Safety line in the paste prompt: never send/purchase/publish/delete without approval; flag unverified; show proposed projects/sources/routines and wait for OK before creating.

He ships a ready-to-paste prompt for the Chief of Staff bot, and recommends trying **one project for seven days** before expanding.

## Useful for a software factory?
- **Yes as a pattern, maybe as Pages.** Externalising project state out of chat matches poteto / Agentic Workflows / "receipts" — living notes the agent must read and update, not a forever-thread. Same family as the Tw93 "living notes file" reply on this thread and as Sam's own `software-factory-notes` habit.
- **Grok Bot multi-bot teams (Chief / Researcher / Ram):** Pages can be the shared board those bots already lack; "read first, update last" is the trait that stops redoing work and losing decisions. Pair with existing rules (writer ≠ reviewer, no irreversible actions without approval).
- **At work (Copilot-only, ADO, Python/TS):** Pages themselves don't transfer. Steal the shape — one markdown (or ADO wiki) page per workstream, agents/routines update it, humans get exception-only pings — not the Grok-specific canvas UI.
- **Overlap with git notes:** reading-notes already version decisions in a repo. Don't duplicate; either point the Master Index at the repo paths, or keep Pages for *active ops* (next action, blockers) and the repo for *durable reading notes*.

## Caveats / hype
- **Usage cost.** Heartbeat routines that poll email/GitHub/Notion every weekday burn quota. Thread replies already call usage the real struggle; start with one project and watch `CheckSubscriptionUsage` before scaling.
- **Pages ≠ better management.** @tomhudock: "human readable, not necessarily better managed." Without the discipline (read first / update last / don't mark done without a check), Pages just become another place to rot.
- **Memory concern.** Some replies worry short chats wipe bot memory. Counter: put durable facts (logins via vault, standing instructions, decisions) on the Page / in skills / in the notes repo — not only in chat history. Unverified whether Pages alone beat bot memory + skills for long-running context.
- **Author claims** ("after working through it with my Bot team") are anecdotal; no metrics, no open template beyond the pasted prompt. Treat as a playbook to trial, not evidence.

## Takeaway
Steal "chats do the work; Pages (or a living doc) remember and manage it," plus exception-only reporting and a 7-day single-project trial. Wire it to existing traits and the notes repo; don't stand up a second source of truth or a swarm of heartbeats that quietly burn usage.
