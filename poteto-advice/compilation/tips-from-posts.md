# Tips from poteto's X posts (14 Sep – 26 Oct 2026)

This collects her practical tips, grouped by theme. Each one is quoted or closely paraphrased and links to its post. Times are UK time; until 25 Oct that was BST, after that GMT. Only the dates are given here. The full posts are in [`../raw/x-posts/`](../raw/x-posts/README.md).

## Prompts worth stealing

- **Alignment first.** "restate in your own words what you think my goals are and what the problem i'm trying to solve is" ([29 Sep](https://x.com/poteto/status/2104744961904394699)). This became `/in-your-own-words` in pstack 0.15.23: "extremely useful to ensure that you and your agent are aligned on the goal" ([13 Oct](https://x.com/poteto/status/2110047236369547621)).
- **Catching up across many agents.** "/bro catch me up on everything since my last message, and if there are any action items for me give me enough context (exec summary) to make a call". She had 16 Cursor Projects running in parallel ([10 Oct](https://x.com/poteto/status/2109024196760305861)).
- **Making a codebase agent friendly.** "/poteto-mode create a new Project agent to refactor and rearchitect my repo so that our architecture is more agent friendly. it should use both the /correct and /architect skill to look through past commits and find the most common pitfalls … answer its own open questions by prototyping rather than defer to me. come back to me with a plan backed by real data" ([4 Oct](https://x.com/poteto/status/2106542593656111276)). The longer 16 Oct version adds Slack messages, review comments and `/recall` on past transcripts ([16 Oct](https://x.com/poteto/status/2111133080526495985)). Both are in [core-principles §3](core-principles.md#3-the-inverse-pyramid).
- **New skills come with evals.** "/poteto-mode create a skill that does <xyz> and eval it" ([15 Oct](https://x.com/poteto/status/2110759504778592664)).
- **Bugs**: use `/poteto-mode`, "which has a bugfix playbook. it'll basically try to repro and root cause first before doing a fix" ([14 Oct](https://x.com/poteto/status/2110158810040217784)).
- **When you don't understand something:** "ask your agent! they can come up with all sorts of visualizations and diagrams to help you understand" ([8 Oct](https://x.com/poteto/status/2108297694561394852)). Also: "you can still read what your agent wrote. better yet, you can ask it to explain it to you, it has infinite patience and ability to teach" ([11 Oct](https://x.com/poteto/status/2109351026981810443)).

## Environment over instructions

- "if you spend the tokens upfront to improve your agents' environment so they fall into a pit of success, you'll spend less tokens in the long run on reworking things" ([4 Oct](https://x.com/poteto/status/2106894888814137460))
- "move stuff out of prose and make it deterministic. the skills i share here just help you with doing that" ([16 Oct](https://x.com/poteto/status/2111211085575716902))
- "this saves you tokens by turning prose (not enforceable) into something deterministic like better API design, better types, and lint rules" ([14 Oct](https://x.com/poteto/status/2110200669282185708))
- On the Erlang idea: "'let it crash' -> 'let it write slop' and then designing both the codebase and constraints to make it so that on average the agent generated code is of high quality" ([11 Oct](https://x.com/poteto/status/2109338732713447790))
- "most of the volume of PRs i land are refactoring" because the "codebase is memory" ([11 Oct](https://x.com/poteto/status/2109361189071499640)). Also: "most of my agents are working on polish and code quality to help my team move faster! bug fixes, performance, improving ci, refactoring" ([4 Oct](https://x.com/poteto/status/2106841470636564539)).
- **TTR for legacy code**: imagine you need to do a rewrite and think through how you'd go about it, "as a way to work backwards to identify improvements to your existing legacy code" ([7 Oct](https://x.com/poteto/status/2107920188494709220))

## Comments and migrations

- "ban and delete most if not all code comments! … a seemingly harmless comment explaining some temporary workaround is one of the worst viruses you can have in your codebase" ([13 Oct](https://x.com/poteto/status/2110149626133438732))
- "if the comment explains why some code is the way it is, it's better if you can figure out how to not need the comment in the first place, eg a better API" ([13 Oct](https://x.com/poteto/status/2110153545802772673))
- Keep the ones "that actually should exist (like explaining a browser quirk)" ([14 Oct](https://x.com/poteto/status/2110229505864552902))
- **Migrations**: "i wouldn't rely on comments at all. i would create a lint rule to block new usages of the old pattern to stop the bleed, then open PRs to rewrite all previous patterns to the new one" ([14 Oct](https://x.com/poteto/status/2110161793331208527))
- "`# DEPRECATED: use xyz` is not actually useful though, it is wishful thinking lol. a lint rule is far more effective and actually enforceable" ([14 Oct](https://x.com/poteto/status/2110162994869227719))

## Verification

- "this is the entrypoint into your most basic agentic loop: verification … by actually running and interacting with it like a real user would" ([12 Oct](https://x.com/poteto/status/2109436202554372476))
- **Feature map**: "just makes it easier for your agents to understand all the features available in your app and how to get to them from a user pov. think of it like docs" ([8 Oct](https://x.com/poteto/status/2108098335152521311))
- **Statecharts plus TLA+**: ask the agent to draw a statechart, then use the formal verification skill to find bugs ([21 Oct](https://x.com/poteto/status/2112736749281759566), [22 Oct](https://x.com/poteto/status/2113398433977659654))
- **Expect and fixture tests**: the React compiler fixtures are her example ([26 Oct](https://x.com/poteto/status/2114630175040348590))

## pstack usage

- **10-second tutorial**: run `/setup-pstack`, put `/poteto-mode` in front of rigorous prompts, ask `/poteto-help` ([15 Oct](https://x.com/poteto/status/2110757066709356851))
- "you don't have to use /poteto-mode for everything - just your hardest tasks that need the most rigor" ([15 Oct](https://x.com/poteto/status/2110534523389943974)). Elsewhere she adds "i find that most engineering tasks end up needing the rigor" ([14 Oct](https://x.com/poteto/status/2110158810040217784)).
- "mix and match and take what you need! … there's no token cost to installing it" ([15 Oct](https://x.com/poteto/status/2110760668987322408))
- "some skills are just genuinely a list of steps that describe a workflow. like /arena works, agents will not do that automatically" ([14 Oct](https://x.com/poteto/status/2110502000437924249))
- "pstack is now 10% smaller with no loss in behavior" ([11 Oct](https://x.com/poteto/status/2109116030761230571)), and skills will keep shrinking "until they're basically just saved prompts" ([24 Oct](https://x.com/poteto/status/2114099131845423142))
- Grok Bot: "you can tell your bot to always spawn cloud agents with the mode set to poteto-mode by default" ([14 Oct](https://x.com/poteto/status/2110498826813649079))

## Bots, routines and workflow

- **First and last mile**: connect apps for context, add routines, then hand off coding to cloud agents and build loops ([6 Oct](https://x.com/poteto/status/2107510472601985336))
- "i'd even recommend doing everything with one bot first before you make new ones" ([7 Oct](https://x.com/poteto/status/2107830403549831186))
- **Release and QA bot** with a fuzz swarm using verification skills and the feature map ([6 Oct](https://x.com/poteto/status/2107527180263829827))
- **Mention triage**: "my bot that responds to my X mentions just sends the report to slack, where i have another bot … uses pstack to do the triage/repro and fix" ([8 Oct](https://x.com/poteto/status/2108253488451100877))
- **Cost**: "ask your bot to check for expensive routines, reduce bot 2 bot messages. usually its the routines though that add up quickly" ([23 Oct](https://x.com/poteto/status/2113479806952276140))
- **Personas** are "a useful tool for the human to manage and organize their work … personas facilitate type 1 thinking and make it easy for you to context switch" ([12 Oct](https://x.com/poteto/status/2109774976987660343))

## Review and scale

- "every PR gets assessed for risk. low-medium risk ones don't require a review so you just merge it. also bugbot of course" ([8 Oct](https://x.com/poteto/status/2108283057581195413))
- **Readiness metrics**: % of agent-written code merged, revert/rework rate, human messages per accepted PR ([7 Oct](https://x.com/poteto/status/2107923381001781362))
- "these aren't new problems! is there a single person at Facebook/Google who understands the whole codebase" ([11 Oct](https://x.com/poteto/status/2109369479683776656)). Also: "there are many human written codebases no one fully understands … we have always needed to deal with imperfect understanding" ([11 Oct](https://x.com/poteto/status/2109307380605595996)).
- "volume does matter": at big companies, volume always mattered at the tails, and "big tech co problems are now small-medium co problems as well" ([8 Oct](https://x.com/poteto/status/2108290818746528017))

## Mindset

- "you should be more ambitious / way more ambitious" ([8 Oct](https://x.com/poteto/status/2108299315764777171))
- "it's the new job of the software engineer to figure out how to produce high quality code at scale" ([8 Oct](https://x.com/poteto/status/2108294013589852213))
- "writing is thinking … being able to clearly express what i want, and knowing the vocabulary i need to be able to direct my agents does seem to make for more effective usage of agents" ([13 Oct](https://x.com/poteto/status/2109885001584292091))
- Interviews could "collapse into just 2 technical rounds": system design, and "onsite project to build a real thing with agents" ([9 Oct](https://x.com/poteto/status/2108689504811012135))
- **Product**: "deleting the product" ([3 Oct](https://x.com/poteto/status/2106202416853262408)). Features are rarely removed when individuals own OKRs: "users will notice that you ship your org chart".
