# Core principles

This compiles poteto's own words from her talks, the live sessions and X posts (14 Sep – 26 Oct 2026). Talk quotes are auto-captions, so they keep the filler words. Links to individual posts go to x.com.

Transcripts referred to below:

- **Talk**: "How I Shipped 2000 PRs Last Month"
- **Live session**: the hour-long session with Q&A
- **Pocock**: the Matt Pocock livestream

## 1. The bottleneck is trust, so start with verification

The thesis of her talk: "I am the bottleneck, and I need to be able to take all of the knowledge that I have as an engineer and impart them into into my team of agents". You can't go from 1–5 agents to 100 "because you don't have trust in your agents work yet … if you don't have trust and you try to spawn 100 sub agents or cloud agents you're going to quickly find that you're just going to get a ton of [slop] pull requests".

In the live session she draws a "trust curve". With low trust, you are "very heavily in the loop … watching every single output". She compares this to managing people: if a manager doesn't trust their reports, "the mode of operation I'm going to be in is going to be like micromanagement".

**Verification comes first.** From the live session: "the most important skill that you should have in your toolbox when you work with agents is verification … the ability for an agent to actually run the code uh or take CPU traces or heap snapshots or uh you know open an iOS simulator … It doesn't guarantee your agent writes good code uh but it allows them to at least write correct code". Without it, "you are the verifier, right? You you're the bottleneck."

On X ([12 Oct](https://x.com/poteto/status/2109436202554372476)):

> this is the entrypoint into your most basic agentic loop: verification. it means giving your agent the ability to verify its own work, most commonly by actually running and interacting with it like a real user would …
>
> the point is to give yourself confidence in the agents' work by them producing some kind of artifact that proves that 1) that the work is correct, 2) that it matches what you intended, and 3) is easier to review than reading the whole PR. most commonly this would be a video and/or screenshots for UI work.
>
> everything else like skill packs are really bonus and optional … so start here!

The levels go from verification skills (driving the app through the Chrome DevTools protocol, traces, heap snapshots) up to formal verification (TLA+, Lean, and later kani, Verus and Bend). See [tooling.md](tooling.md).

## 2. The codebase is memory

From the talk: "the code base is really like the best form of memory because agents love to extend existing patterns that they see … agents aren't going to just refactor your code every single in every single PR. They're going to just look at what's already there and just extend."

On X ([12 Oct](https://x.com/poteto/status/2109699980248408574)):

> the 2 things you should know to cut through all the noise:
>
> 1. you need to give your agent a way to verify its own work
> 2. your codebase is memory
>
> … forget rules and skills. you can add those later.
>
> yes, your codebase is a form of memory to agents! agents love extending what already exists. so every nit and every annoyance you've ever seen, every mistake and bad pattern you observe from agents, needs to turn into a constraint, or the agents will just keep repeating those same mistakes like a virus in your code. then you keep observing and repeating this process until your codebase is locked down enough that even agents with little context can one shot a high quality PR.
>
> an even better direction is to refactor/rewrite your code such that agent anti-patterns become categorically impossible. use type systems to your advantage, use libraries/frameworks that reduce the architectural search space, or heck, create your own framework

**The reverse is also true.** From the talk: "if you have existing anti-patterns, you'll actually find that these will spread kind of like a virus … one small workaround or a comment that explains a workaround, and you'll quickly find that agents just love to copy that." Her metaphors for this:

- **a garden** that needs a "gardener" role on every team
- **a Michelin kitchen**: "we're setting up our kitchen in a way that makes sense … for the agents and bots to do the right thing by default"
- **a bonsai** ([4 Oct](https://x.com/poteto/status/2106542593656111276)): commits "are like a bonsai tree rapidly growing in whatever direction it pleases. what you want to do is not to give in to the chaos, but tame it intentionally with the right constraints"

**Constraints are old wisdom.** From [5 Oct](https://x.com/poteto/status/2106916667599278365): "large companies have had to solve this problem since even before agents. because before you had agent slop, you had human slop … the solution to this was constraints: lint rules, smarter compilers and diagnostics, high quality tests, investments into observability … the arrival of agents just means that big company problems are now everyone's problems."

In the live session she adds that brownfield apps at big companies are "in a pretty good spot" because the guardrails already exist, and that vibe-coded greenfield apps are "the biggest risk".

## 3. The inverse pyramid

[16 Oct](https://x.com/poteto/status/2111133080526495985), the post Sam bookmarked:

> how do you trust your agents' work more? copy this post/link and give it to your @bot or agent!
>
> 1. codebase improvements: this is just good software engineering - better architecture, stronger types and invariants, clear boundaries. agents love to copy what exists and take the shortest path, so make the easy thing the right thing. categorically eliminate problems through code and you won't need to think about it again.
> 2. static analysis: lint rules, tests, CI, verification (eg TLA+). very token efficient ways to catch issues ahead of time.
> 3. prose: comments, rules, AGENTS.md, skills - anything that can't be enforced and requires agent judgment. use it minimally, but do use /create-verification-skill.
> 4. human review: the hardest to scale. at the rate agents land code, it's pretty much impossible to thoroughly review every PR, so spend that effort on the highest leverage point, designing an environment where agents do the right thing by default.
>
> this forms an inverse pyramid: you want most of your effort at the top, least at the bottom. codebase improvements are deterministic, making it more token efficient, and lets you sleep more soundly at night.

The talk version has five steps: codebase, static analysis, rules/Bugbot/skills, then a style guide "which is really only enforceable by humans in a code review". "whenever you find yourself correcting and intervening your agent, um you really want to think about it from these five pieces and where is the most effective step in this sequence".

Her `/correct` skill turns this into the order **architecture > types > lint/CI (error names the fix) > behaviour tests > docs last**. See [tooling.md](tooling.md#correct-in-detail).

Her suggested **project prompt**, from the same post:

> 1. look through my slack/chat messages and code review comments where i've given feedback on PRs, code, architecture
> 2. use /recall on my past transcripts to learn how i steer agents
> 3. /poteto-mode use /correct and /architect on past commits to find the most common pitfalls agents fall into, then propose a plan to rearchitect the code i own so it's more agent friendly. answer open questions with prototyping rather than defer to me, and back the plan with real data.
> 4. before you begin, use /sharpen + /in-your-own-words and confirm this prompt with me

## 4. Context, not control

poteto doesn't use this exact phrase. It's the thread running through several of her posts:

- [4 Oct](https://x.com/poteto/status/2106542593656111276): "it's easy to fall into the trap of micromanaging your agents instead of correcting the environment that shapes its behavior."
- [6 Oct](https://x.com/poteto/status/2107510472601985336), on Grok Bot's "first mile": connect your apps so you can "provide context to your bot ('look at this slack channel for new features we've built and then look through our CRM to see which customers we should nudge') instead of micromanage it."
- [7 Oct](https://x.com/poteto/status/2107830403549831186): connect the apps you use "so that your bot has enough context about the work you do, and the tools it needs to do the job"; and "i'd even recommend doing everything with one bot first before you make new ones."
- From Pocock: past chats are "a treasure trove of context because … it's like the process materialized right like it's the real process not an abstract idea in your head". This is why `/recall` exists.
- Her prompts tell agents to answer open questions "with prototyping rather than defer to me". pstack's principle "Never Block on the Human": "proceeds on reversible work and presents the result".
- Her most-liked prompt ([29 Sep](https://x.com/poteto/status/2104744961904394699), about 13.6k likes as of 26 Oct): "restate in your own words what you think my goals are and what the problem i'm trying to solve is". It became `/in-your-own-words`. Align on intent, then let the agent work.

So: give the agent the context and the environment, then let it run. Don't steer every step.

## 5. Stop the bleeding

From the talk: "whenever you see tech debt or bad patterns, your instinct should be I need to write a lint rule against it. You don't always have to clean up immediately because if you write a lint rule, you can at least stop the bleeding … it at least prevents it from growing." Then "get your agents to clean them up so that your code base is just constantly kept in a state where you would be happy if an agent would have copied it."

On X:

- [14 Oct](https://x.com/poteto/status/2110164056422465845): "the deprecation comment is not enforced, and agents will continue propagating the pattern everywhere else … you cannot stop the bleed with a comment".
- [14 Oct](https://x.com/poteto/status/2110162994869227719): "`# DEPRECATED: use xyz` is not actually useful though, it is wishful thinking lol. a lint rule is far more effective and actually enforceable. and then of course you should actually finish that migration".

`/correct`: "If the pattern is already common, fail only when a change adds more." In practice, that means a lint rule with a baseline, so only new uses fail, followed by migration PRs. pstack principle: "Migrate Callers Then Delete Legacy APIs … migrates and deletes in one wave."

The Dune principles, from the talk:

1. delete existing tech debt
2. "keep or enforce a single paved path for most blessed patterns … one conventional way to do some things"
3. write a lint rule whenever you see a bad pattern

## 6. Ban comments and `useEffect`

**Comments.** From the talk: "agents were just using the comments around the code as justification for why it wasn't going to solve the actual problem. And instead paper over it with a band-aid … So, in Dune … we made the choice to actually ban comments".

[13 Oct](https://x.com/poteto/status/2110149626133438732): "ban and delete most if not all code comments! … a seemingly harmless comment explaining some temporary workaround is one of the worst viruses you can have in your codebase. like a weed it'll spread quickly".

Her reasons ([14 Oct](https://x.com/poteto/status/2110214162400137637)):

- "comments go stale very quickly and confuse agents and people"
- "they are often used by agents to explain workarounds that would've been better off actually fixing the code instead"
- "they are not enforceable and waste your agents' tokens"

"my point is that moving prose (comments, rules, agent.md, skills) into deterministic lint rules, better API design/types, is far more effective".

`/no-comments` keeps "the ones that actually should exist (like explaining a browser quirk)".

**`useEffect`.** From the live session, CI chapter: "one of the biggest foot guns in React is use effect. Uh so in uh Dune and in [Grok Bot] we've banned use effect … CI will fail uh and yell at you." Other CI checks she mentions:

- the comment ban: "99% of the time agents just write code comments that kind of describe some historical thing that is actually totally irrelevant"
- import-graph checks that stop Electron renderer code from importing main-process code, which is slow code on a 16 ms frame budget

All of these are "enforced by CI um as well as bug bots … in our agents MD it's everywhere".

**Design for the dumbest agent.** From the live session: "it's like designed again for you know like the dumbest agent like you don't have to think, right? … the shortest the shortest path is the best path … they'll find the quickest way to solve the problem. So why not make that the best way to solve the problem?" And: "CI is like it's actually very annoying to write code in … but like agents absorb all of that annoyance."

A Sam bookmark ([@0xWaunty](https://x.com/0xWaunty/status/2110007607494672584)) summarises the session as: "Verification → Evals → One directory → CI bans → Cloud agents".

The concrete config is in `../ai-friendly-environments/react.md` and `comments.md`.

## 7. Feature maps

From the talk, the verification skill ("control glass") has two parts:

- **A CLI**, kept in the skill directory: "rather than have your agents create scripts every time … you can actually create a CLI that's within the skill directory, and then your agents will just use that every time."
- **A feature map**: "inspired by like a site map. Um it essentially is a uh form of materialized memory, you know, like how exactly does your application work? What features does it have? How do it does a user reach it? … keyboard shortcuts or what DOM elements to click on".

Why the feature map: bug reports arrived as "a very vague screenshot … and just like three question marks", and agents "would just be guessing". The map is "stored in the skill itself … And we have an automation that uh maintains this feature map as well." With the two together, agents could both drive the app and understand vague reports. The skills "become more or less uh critical infrastructure for our team".

pstack's `/maintain-verification-skill` is the periodic pass that "keeps a project's verification skill and feature map honest".

## 8. Short skills, tested with evals

- [14 Oct](https://x.com/poteto/status/2110496830429839869): pstack's principles are "very concise skills (~10-20 loc) that distill down good practices into its core. as models get smarter, i expect most of pstack skills to compress into short principles or workflows". `/poteto-mode` tells agents to "name each principle that shaped a decision and the specific choice it changed", which is where the "Principles Named" section comes from.
- [13 Oct](https://x.com/poteto/status/2109912648116826250): skills "are just saved prompts that capture some workflow you want to repeat later. for my own skills in pstack I also do run evals on them so I know they actually do modify the agents' behavior positively".
- [24 Oct](https://x.com/poteto/status/2114099131845423142): "the more capable models get, the less instructions they need. over time i expect the skills to shrink more and more, until they're basically just saved prompts".

**How she evals**, from the live session:

- an eval is "like a unit test for an agent"
- a coordinator writes a rubric, then spawns sub-agents in directories "cleverly named to not let the sub agent know that it's being evaluated because, uh, agents can actually tell and when they do, they change their behavior"
- a judge on a different model cross-checks the scores
- she runs the skill across models, and loops (e.g. with `/loop`) "until everything is 10 out of 10"
- "Every time I I modify a skill, I will run one of these"

pstack ships this as the eval playbook under `/poteto-mode`. A quick way in, from her [15 Oct reply](https://x.com/poteto/status/2110759504778592664): "/poteto-mode create a skill that does <xyz> and eval it".

On maintaining skills: "it requires I think a lot of taste and observation. So, you kind of need to be very good at being a backseat driver … opening up the all the tool calls and like reading the code and reading all the uh the agent behavior and their thinking blocks".

## 9. Readiness metrics

Her "time to (fully automated, hands off) rewrite", or **TTR**, thought experiment ([7 Oct](https://x.com/poteto/status/2107913381751730352)) is "a thought experiment and rough heuristic, not a real number that can be compared": "lets say you decided to rewrite your code in a different language/framework/architecture. how long would it take a single engineer to do it? … the number itself isn't that important, but it leads you to more questions". For example, would you trust the result, could agents verify it was identical in user-visible behaviour, and would quality hold up "as PRs start flowing into it?"

How to measure it ([7 Oct reply](https://x.com/poteto/status/2107923381001781362)):

> - % of agent written code that gets merged
> - revert / rework rate
> - # of human messages per accepted PR (less is better)

Also ([7 Oct](https://x.com/poteto/status/2107922229711585334)): "there's also many ways to improve ttr deterministically, like with a high quality test suite, using libraries like XState … or @EffectTS_ to make it easier to enforce business logic invariants … your codebase is a form of memory and an input to agents".

**Where it leads:**

- From the live session: "I actually have my agents now um automerging PRs for me … I woke up today and there were like 20 PRs landed and I just reviewed them on [main]".
- [8 Oct](https://x.com/poteto/status/2108283057581195413): "we have agentic code review, so every PR gets assessed for risk. low-medium risk ones don't require a review so you just merge it. also bugbot of course".
- From Pocock: some PRs "are kind of like two-way doors which is you can merge it and then revert it … But there are some PRs that are one-way doors" (data loss and so on), and those need a human. Her morning routine: "I'll review it in the morning by looking at my commit history and if I see problems, I go and course correct … revert or modify, add new lint rules".
- From the live session: she encourages agents to split work into small PRs because "the git history is a very rich source of context" and revert is easier.

## 10. Good code, slop and maintainability (her framing)

[11 Oct](https://x.com/poteto/status/2109110547824378140): Good Code is "correct", "bug free", and "fast and cost efficient to run". It "has always been exceedingly difficult and expensive", and "the vast majority of software we use does not need to be Good Code to provide value to users". She argues "maintainability is not as important as it used to be" for humans ([11 Oct](https://x.com/poteto/status/2109306052495946239)), but "agent maintainability is very important, both for token efficiency and otherwise" ([11 Oct](https://x.com/poteto/status/2109384476707168646)). Her response to "slop" ([12 Oct](https://x.com/poteto/status/2109699980248408574)): you're an engineer, so fix the environment.

## 11. Formal verification is the long-term goal

- [19 Sep](https://x.com/poteto/status/2101384547543978195): "very bullish on Bend … you can only get so far with weak type systems and lint rules. when you have a codebase that can formally verify itself, you can ship at an incredible pace."
- [18 Oct](https://x.com/poteto/status/2111926622278521253): `/create-formal-verification-skill` (TLA+, kani). She "already found several bugs".
- [21–22 Oct](https://x.com/poteto/status/2112736749281759566): statecharts plus TLA+ to "both understand your code b[etter]" and find bugs. The companion statechart skill uses Pele from @kepano.
- [26 Oct](https://x.com/poteto/status/2114613597515190666): "we're still really early … the closest thing you might have for a strict and somewhat verifiable language for agents is rust + something like verus".

## 12. Ron Minsky's talk (recommended by poteto, 26 Oct)

poteto's summary ([post](https://x.com/poteto/status/2114626630429913383)):

> • agents thrive on feedback, and types are one of the best kinds
> • make illegal states unrepresentable with types, and it enforces global rules across your codebase
> • property based tests, fuzzing, and even full-system deterministic simulation testing
> • expect tests: just print stuff out and capture it in the test. makes behavior legible. it's very similar to how compilers have fixture tests, it reduces the review surface area
> • formal methods used to be very expensive: seL4 is about 8,700 lines of C and took around 25 person-years, with 23 lines of proof for every line of C code, but agents change the roi

From the talk itself (Minsky, transcript in `raw/transcripts/`):

- Expect tests are "at their best a tool for driving human understanding of the program under study".
- They are "just another kind of loop closing".
- Output must be designed to be readable.
- He calls "make illegal states unrepresentable" a catchphrase he "sort of by mistake at some point invented".

She points to the React compiler's fixture tests as an example of expect tests ([reply](https://x.com/poteto/status/2114630175040348590)): <https://github.com/react/react/tree/main/compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler>.
