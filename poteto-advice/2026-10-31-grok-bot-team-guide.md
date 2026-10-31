# poteto: short Grok Bot guide for a high-quality bot team (31 Oct 2026)

- Source: https://x.com/poteto/status/2116576229319233596 (@poteto / Lauren Tan). Europe/London: Sat 31 Oct 2026, 17:01 UTC.
- Follow-up tips (same thread): https://x.com/poteto/status/2116580481236115933 (17:18 UTC).
- Linked bot: [dr eggbot](https://x.ai/bot/_jOdbfkB16zxu7MRcmReE) — “Designs high-quality Grok Bots… Coding bots get the poteto-mode bar (one job, unslopped, verified).” Created by a third-party user (poteto), not SpaceXSI.
- No quoted post on the root; thread replies from poteto are the “more tips” note plus short ack replies (tag @bot / copy link; cc @parker__conrad; “yeah we’re constantly improving this!” on proactivity).
- Folder: **poteto-advice/** (advice on working with agents / managing a bot team). Matches themes already in `compilation/tips-from-posts.md` (few bots, skills, routines cost, restatement).
- Related: workshop note `2026-10-28-poteto-agent-team-workshop.md`; pstack; Sam’s multi-bot / GHCP software factory.

## Verbatim tips (root post)

> here’s a short grok bot guide on how i create high quality bots and manage my team. ask @bot to read this post and help you improve your team!
>
> • add dr eggbot to your team! he’s my bot designer that i use to create bots
> • you don’t need a lot of bots. a few good bots can be more useful and easier to manage than a large team
> • tell your bots to create skills for itself as you give it instructions on how to do tasks. this lets them do them more consistently even over long conversations. you can even ask it to create a private github repo for you to store all your skills if you want them preserved independently
> • add connectors, use the vault, and give access to all the tools you use to do your work. you can also ask your bot to setup its own email and it can sign up for its own accounts for better separation
> • thinking about all the work you do by hand, or steps in your workflows where you have to copy and paste information back to your bot. ask your bot how it can do that for you instead!
> • imagine you hired an intern, how would you onboard them and help them do the work correctly and efficiently? introduce yourself to your bot and describe the work you do, then ask it how it can help you automate it
>
> and my favorite tip: use voice mode or the transcription option! it’s a good way to just brain dump a lot of information. then, at the end, tell your bot to “restate this in your own words” so you can confirm it understood you

## Verbatim tips (follow-up)

> more tips:
>
> • routines help your bot be more proactive. you can setup a scheduled one, like “check our issue tracker every morning for new bugs”, or a subscription routine that responds to something happening, like “whenever i get an email from client X, automatically summarize and add their feedback and suggestions to my notion doc”
> • routines can be expensive if they fire too often. hourly is the most frequent interval i would recommend for scheduled ones, and for a subscription you should filter the events first
> • ask your bot to write code for you to automate tasks! code is much more efficient as it doesn’t require as many tokens as the bot doing the task itself. just ask your bot which parts of your workflows could be turned into scripts and skills instead. and tell it to store the scripts in a private github repo
> • if you work on a team plan, share your bot in slack! it’s a great way to share workflows with your colleagues, and to reuse high quality bots your team already maintains
> • think like a manager: how do you get bots to do your tasks with the same or even better quality than you can? if you can setup your bots this way, this frees you up to do much more ambitious things

## Themes (map to existing compilation)

| Theme | Where it already lives |
|---|---|
| Few bots / start with one | tips-from-posts (bots as teammates); workshop trust curve |
| Skills from live instructions; store in private GH repo | tips-from-posts (skills + evals); core-principles inverse pyramid |
| Connectors, vault, own email / accounts | tooling (Grok Bot); applying-at-microsoft connectors analogue |
| Remove copy-paste / handoffs; intern onboarding | environment over instructions |
| Voice dump + “restate … in your own words” | Prompts worth stealing (`/in-your-own-words`) |
| Routines (scheduled + subscription); hourly max; filter events | tips-from-posts cost note (23 Oct) |
| Prefer scripts/skills over the bot doing the task every time | move prose → deterministic |
| Share bots in Slack on team plan | bots collaborate (24 Oct) |
| Think like a manager / quality ≥ you | mindset; readiness metrics |

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | How this post maps |
|---|---|
| **Custom agents** | Few specialised agents (not a swarm). Optional “bot designer” agent analogous to Dr Eggbot for spinning new custom agents with one job and verification. |
| **Skills** | After each workflow tip, ask the agent to write a skill; keep skills in a private GitHub repo as durable memory across chats. Pair new skills with evals (existing poteto rule). |
| **Instructions / Memory** | Intern-onboarding brief: who Sam is, what the work is, what “done” means. Restate-in-own-words as a standing alignment step (pstack `/in-your-own-words`). |
| **Coding agent** | Prefer generating scripts/skills that Actions or the coding agent run, instead of burning tokens on the same manual loop. Store those scripts in the private skills/bots repo. |
| **Agentic Workflows** | Close to her “routines”: scheduled (morning issue check) and event-driven (email from client X → summarise → Notion). Cap frequency (≥ hourly for schedules); filter subscriptions. |
| **Actions** | Host the deterministic scripts (lint, verify, triage hooks) so quality does not depend on the model remembering prose. |
| **pstack** | poteto-mode bar on coding bots (one job, unslopped, verified) matches Dr Eggbot’s description; keep `/correct`, verification skills, and restatement in the loop. |
| **Slack share** | On a team Copilot/Grok plan, share high-quality bots rather than forking mediocre ones. |

**[Chief] for Sam’s factory:** keep the `bots/` roster small; put skills and automation scripts in the private GitHub repo; wire Agentic Workflows / Actions for anything that would otherwise be copy-paste; use restatement after voice/brain-dump briefs; treat Dr Eggbot as a Grok-Bot-specific designer, and mirror the idea with a GHCP custom agent that only scaffolds new agents against poteto-mode constraints.

## Takeaway

This is a compact operating manual for a small, high-trust bot team: few bots, skills written as you teach, connectors and vault so the bot owns the loop, routines with cost discipline, scripts over repeated token burn, and voice-plus-restatement for alignment. It extends the existing poteto-advice collection rather than contradicting it, and maps cleanly onto Sam’s GHCP custom agents, skills repo, Agentic Workflows, and Actions without ADO.
