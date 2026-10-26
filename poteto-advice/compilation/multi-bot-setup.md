# How poteto (Lauren Tan) structures her Grok Bots

Compiled 2026-10-26. Sources:
- **[V]** Behind the Craft (Peter Yang) "We Built Grok Bot. Here Are Our 14 Best Bots | Peng Zheng & Lauren Tan", 2026-09-27, 45 min — https://www.youtube.com/watch?v=xZ5TEaleUdg. Raw transcript: `video-xZ5TEaleUdg.txt`. It is a Whisper transcript from realalpha.app because YouTube captions were blocked from the box. Timestamps are approximate.
- **[MP]** Matt Pocock livestream with poteto — `interview-1.txt` (no timestamps)
- **[I2]** Cursor interview — `interview-2.txt`
- **[T]** "How I Shipped 2000 PRs Last Month" talk — `video-1.txt`
- **[X]** her X posts (links inline; raw JSON in `/workspace/xfetch/`)

Labels: **Stated** means she said it. **Inference** means it's our reading of what she said.

## 1. Why she has several bots (Stated)
- Start with one bot. "you don't need to rush into making multiple bots! your primary bot is very capable even on its own… the reason you might want to add new bots is for specialization and organization" ([X, 7 Oct](https://x.com/poteto/status/2107830403549831186)). "its often simpler to start with one bot and then only make new bots when it gets tricky to manage. otherwise you can also end up creating too many unnecessary bots" ([X](https://x.com/poteto/status/2108097362283597916)).
- She adds a bot when one bot's context gets too varied. Dr. Eggbot makes her a new bot "when I'm… starting to use like one agent for a lot of things… adding like a lot of context to that agent… very diverse… which can be like maybe confusing" [V ~18:30–20:30].
- Topology is up to you: "a single bot that does everything… multiple specialist bots that each do a narrow slice, or… multiple generalists each owning a different project. the key thing is multitasking. there is a reason that CEOs have multiple SVPs" ([X, 12 Oct](https://x.com/poteto/status/2109781899610874002)).
- Peng's design rationale, from the same episode: tools, connectors and skills are shared, but "memory and preferences are local to each individual bot" [V ~42:37]. Bots are persistent named roles, while chats are per project [V ~8:00].

## 2. The cast (Stated, from the video and X)
| Bot | Job |
|---|---|
| **Chief of Staff** | The bot she talks to most. Handles "all sorts of random things" and breaks big projects into phases, e.g. planning in a Notion doc, then hands them to the eng lead [V ~18:34, ~27:28] |
| **Matcha** (eng lead) | Its Dr. Eggbot-written description lists the bot IDs of four engineer bots and tells it to "never do work on your own and always delegate to those four bots" [V ~25:16–26:01] |
| **4 engineer bots** (food names, e.g. Daifuku, Gyoza) | They act as supervisors and "always spawn cloud agents". She picks the model and reasoning level per task [V ~26:01] |
| **poteto** (social/engineer bot) | Checks her X mentions about every 30 min on a routine and groups reports ("five users have reported the same bug") [V ~32:35] |
| **sandcastle** (release manager, Slack team bot) | Handles release cuts. It DMs contributors, runs the build and starts a fuzz swarm of 10+ agents ([X, 6 Oct](https://x.com/poteto/status/2107527180263829827)) |
| **Tsuki** (personal assistant) | Booked her multi-city trip through Navan after she approved its proposal, and texts her lunch reminders [V ~21:18–24:18] |
| **Crumb** | Local-machine chores, e.g. finding what's filling her disk [V ~15:21] |
| **Dr. Eggbot** (bot designer) | Designs new bots, and engineering bots come with pstack. Runs a routine that reads her bots' transcripts and proposes new skills or bots, or more efficient routines [V ~17:53–21:17] |
| **tibo@mail.grokbot.com** | Her bot's public inbox for bot-to-bot bug reports ([X](https://x.com/poteto/status/2110192382096679248)) |

## 3. How they hand off work (Stated)
- **Chain:** Sam → Chief of Staff → Matcha (eng lead) → engineer bots → Cursor cloud agents or Cursor Projects. "I actually mostly talk to my chief of staff, and then my chief of staff talks to the eng lead" [V ~25:16]. Each layer above the cloud agents only plans and passes messages: "they do all the message passing, but it lets me orchestrate really massive agent swarms" [V ~27:28].
- **Passing context between bots:** "I can go to Matcha and say… Potato said blah blah… go talk to Potato and figure it out and come back to me with a design proposal" [V ~34:11]. Peter Yang summed it up as "all these bots live in the same house".
- **Channels:** Grok Bot group chats, where an @mention gets a reply from only that bot (Peng [V ~6:52]). Slack with team bots, where "@ your bot whenever you want it to do some coding work" ([X](https://x.com/poteto/status/2105377066942349794)) and "have our bots collaborate… like teammates" ([X](https://x.com/poteto/status/2114071326411690209)). Also email between bots, and tagging @bot on X.
- **Routines are the triggers:** bots "subscribe" to Slack, X, email and Linear, and send what they find to a Cursor Project [MP]. One loop she runs daily: Slack feedback → Linear ticket → cloud agent with pstack reproduces it → fix, then a swarm fuzzes the PR → ping her → auto-merge after 1 hour unless she objects ([X, 6 Oct](https://x.com/poteto/status/2107510472601985336)). Another: the X-mentions bot posts reports to Slack, where a second bot runs pstack to triage, reproduce and fix ([X](https://x.com/poteto/status/2108253488451100877)).

## 4. Scaling to "10 features + 100 bugs" (Stated, then Inference)
- **Grok Bot is the outer loop, Cursor Projects are the inner loop** [MP]. A Project is a coordinator agent in the cloud, "like your executive chef… your chief of staff. It doesn't do the work itself" [MP]. "i use cloud agents for one off smaller things… and projects for a group of things (fix all the bugs users have reported on slack)" ([X](https://x.com/poteto/status/2107954395979944361)). She has had "16 right now" Projects running at once ([X](https://x.com/poteto/status/2109024196760305861)) and describes "more than 10 chiefs of staff… each working on a different area" [MP].
- **She groups related bugs instead of spawning one agent per bug.** One agent per report means "you've lost that sort of thread between them… you may duplicate work" [MP]. For lint-pattern hunting, an agent appends findings to a document and she reviews the buffer every few days to spot patterns [MP].
- **Verification gates the merge.** pstack's full-autopilot mode spawns verifier agents that fuzz each PR, and it lands only after it passes. She reviews after merge by reading the commit history, and when she spots a recurring problem she fixes the environment (lint rules, types, skills) rather than the single PR [MP]. "sometimes I actually don't even look at the PR until after it's landed" [V ~27:28]. That only works because the codebase is "very agent friendly".
- **What she keeps for herself:** decisions, with a request like "if there are any action items for me give me enough context (exec summary) to make a call" ([X](https://x.com/poteto/status/2109024196760305861)). She also samples review quality, designs the environment, and approves anything risky, such as purchases [V ~23:30] and only higher-risk PRs ([X](https://x.com/poteto/status/2108088020146720913)).
- *Inference:* for 10 features and 100 bugs, the sources point to roughly one Project per feature or theme plus one bug-triage Project fed by routines, with the bots doing the routing. They don't point to 110 separate agents.

## 5. Are they smart enough? Limits and failure modes (Stated)
- She frames it as a question of trust in the environment more than intelligence. Spawning 100 cloud agents without trust gives "a ton of slop pull requests… regressions" [T]. "don't… jump to… spawn hundreds or thousands of cloud agents right now… waste a lot of tokens… extremely expensive" [I2 ~29:25].
- Cost: routines that run often are expensive because "it just keeps waking up the agent. If you do every 10 minutes, that's a lot of wake-ups" [V ~21:17]. On cost: "check for expensive routines, reduce bot 2 bot messages" ([X](https://x.com/poteto/status/2113479806952276140)). Large subagent swarms are "usually where the cost comes from" ([X](https://x.com/poteto/status/2110498629307990461)).
- Too many bots, or one bot with too much varied context, causes confusion [V ~18:34; X above].
- Agents copy what's already in the codebase and take the shortest path, so bad patterns spread unless the environment stops them ([X](https://x.com/poteto/status/2111133080526495985)).
- Getting there "takes a lot of time and effort… very hard to get to this point" [MP]. Her path is gradual: watch the bot, correct it, turn the fix into a skill, and once it one-shots, make it a routine [V ~39:55–41:29].

## 6. Transferable to Sam's setup (Inference)
- Start with **one bot** and add an "eng lead" layer only when a single context gets crowded.
- The eng lead layer should **only delegate**, and its instructions should list exactly which workers it may call. In Sam's setup, the workers are headless Copilot CLI runs in worktrees, and ADO PRs replace Cursor cloud agents.
- **Group bugs by theme** into one coordinator run, e.g. an ADO query → one triage job. Don't start one agent per work item.
- Use routines as triggers on ADO events, Teams channels and pipeline failures. Keep the polling interval coarse because of cost.
- Earn auto-merge the way she did: verification first (lint, types, tests, Playwright fuzz). Then auto-complete ADO PRs only for low-risk paths, review the main branch history the next day, and fix recurring problems with lint rules or types.
- A Dr. Eggbot-style weekly review of the bots' transcripts and logs that proposes skill and routine changes.
