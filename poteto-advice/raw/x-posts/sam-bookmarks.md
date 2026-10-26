# Sam's (@samthellm) X bookmarks related to poteto's advice

Fetched 2026-10-26 from the bookmarks API (the API returned 21 bookmarks in total, which is all of them). Listed here: the ones by @poteto or about her advice, plus two agent-tooling bookmarks from the same weeks. Unrelated older bookmarks (SpaceX launches, 2023 AI news etc.) are left out.

## @mrmagan_ — 2026-10-23 21:26 UTC — [2113743983839203685](https://x.com/mrmagan_/status/2113743983839203685)

Why it's here: unclear relevance (image only)

> I bet a lot of people are having the same idea I'm having... https://t.co/1FutXeBlR6

## @__morse — 2026-10-21 17:11 UTC — [2112954960627536111](https://x.com/__morse/status/2112954960627536111)

Why it's here: Playwriter (browser control for agents) - tooling discussed alongside her advice

> playwriter is the easiest way to control your Chrome browser with agents
>
> just install an extension and all your agents from opencode, pi, claude can control Chrome
>
> and it's programmable with scripts: you can ask your agents to write SDKs & CLIs that use your logged in websites https://t.co/REJVQW0245

## @boristane — 2026-10-18 23:43 UTC — [2111966450311385154](https://x.com/boristane/status/2111966450311385154)

Why it's here: code review loop for agents - related

> the only sane code review loop https://t.co/RrgbGgrymo

## @poteto — 2026-10-16 16:32 UTC — [2111133080526495985](https://x.com/poteto/status/2111133080526495985)

Why it's here: poteto: inverse pyramid / how to trust agents

> how do you trust your agents' work more? copy this post/link and give it to your @bot or agent!
>
> 1. codebase improvements: this is just good software engineering - better architecture, stronger types and invariants, clear boundaries. agents love to copy what exists and take the shortest path, so make the easy thing the right thing. categorically eliminate problems through code and you won't need to think about it again.
> 2. static analysis: lint rules, tests, CI, verification (eg TLA+). very token efficient ways to catch issues ahead of time.
> 3. prose: comments, rules, AGENTS.md, skills - anything that can't be enforced and requires agent judgment. use it minimally, but do use /create-verification-skill.
> 4. human review: the hardest to scale. at the rate agents land code, it's pretty much impossible to thoroughly review every PR, so spend that effort on the highest leverage point, designing an environment where agents do the right thing by default.
>
> this forms an inverse pyramid: you want most of your effort at the top, least at the bottom. codebase improvements are deterministic, making it more token efficient, and lets you sleep more soundly at night.
>
> install https://t.co/u9xIlN3eN0 and create a new Project:
> 1. look through my slack/chat messages and code review comments where i've given feedback on PRs, code, architecture
> 2. use /recall on my past transcripts to learn how i steer agents
> 3. /poteto-mode use /correct and /architect on past commits to find the most common pitfalls agents fall into, then propose a plan to rearchitect the code i own so it's more agent friendly. answer open questions with prototyping rather than defer to me, and back the plan with real data. 
> 4. before you begin, use /sharpen + /in-your-own-words and confirm this prompt with me

## @poteto — 2026-10-14 22:23 UTC — [2110496830429839869](https://x.com/poteto/status/2110496830429839869)

Why it's here: poteto: pstack engineering principles

> perhaps one of the most durable parts of pstack are its engineering principles: very concise skills (~10-20 loc) that distill down good practices into its core. 
>
> as models get smarter, i expect most of pstack skills to compress into short principles or workflows (a generic list of steps) and that i will be able to delete a few of them. 
>
> how it works is that /poteto-mode contains a short index of available principles and tells agents "In your reply, name each principle that shaped a decision and the specific choice it changed." this is why you'll often see a Principles Named or Used section at the end of the agent's response
>
> many of these principles were extracted from my sessions correcting agents since the start of this year. some are inspired by problems i see people talk about, like Attack the Premise, inspired by @VictorTaelin's post https://t.co/qTGVfoKSyD
>
> you can also use the principles as skills if you want greater control, by invoking /principle-<name> 
>
> https://t.co/wuTWsflVN3

## @0xWaunty — 2026-10-13 13:59 UTC — [2110007607494672584](https://x.com/0xWaunty/status/2110007607494672584)

Why it's here: summary of poteto's live session (bans comments and useEffect)

> SpaceX AI engineer Lauren Tan:
>
> "Design for the dumbest agent"
>
> She bans code comments and useEffect so her agents can't write bad code
>
> In one live session, she shows exactly how to set it up
>
> Verification → Evals → One directory → CI bans → Cloud agents
>
> Step 1 → give your agent eyes and hands - it runs the real app, takes CPU traces, opens the simulator
>
> Step 2 → unit test your skills - sub-agents run them, a judge on another model scores, loop until 10/10
>
> Step 3 → one directory per feature - agents love shortcuts, so the shortest path has to be the right one
>
> Step 4 → ban the bad patterns in CI - no useEffect, no code comments, no cross-thread imports
>
> Step 5 → send bug reports to a cloud agent - it reproduces each one and flags the ones already fixed
>
> The result: PMs and designers ship features straight into Grok Bot and she just stamps them
>
> Worth more than most $800 AI coding courses
>
> Bookmark and watch it today

