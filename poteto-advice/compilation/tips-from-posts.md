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

## 23 to 28 Oct additions

Merged from the former `new-since-2026-10-23.md` on 18 Nov 2026 (the Grok Bot product-news section was dropped as off-topic).

This covers poteto's posts and replies from 23 Oct up to 26 Oct 08:25 UK time, when they were fetched. Times are UK time (BST until 25 Oct 02:00, then GMT). The full text of each post is in [`../raw/x-posts/new-since-2026-10-23.md`](../raw/x-posts/new-since-2026-10-23.md). That file uses UTC and starts at 23 Oct 00:00 UTC, which is 01:00 BST.

**Volume:** about 100 posts. 87 are replies, mostly Grok Bot support, feedback routing ("@bot send to the feedback-pages slack") and banter. The engineering content is below.


### 1. Ron Minsky's talk is worth watching, and expect tests in particular (26 Oct)

- **07:54 GMT** ([post](https://x.com/poteto/status/2114626630429913383)): "so many gems and great tips in this talk from @yminsky about how to improve your codebase for agents".
  - "agents thrive on feedback, and types are one of the best kinds"
  - "make illegal states unrepresentable with types, and it enforces global rules across your codebase"
  - "property based tests, fuzzing, and even full-system deterministic simulation testing"
  - "expect tests: just print stuff out and capture it in the test. makes behavior legible. it's very similar to how compilers have fixture tests, it reduces the review surface area"
  - "formal methods used to be very expensive … but agents change the roi"
- **08:08 GMT** ([reply](https://x.com/poteto/status/2114630175040348590)): "here's one example of expect tests, we used these rigorously for react compiler". The link is the compiler's fixture folder: <https://github.com/react/react/tree/main/compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler>.
- **07:26 GMT** ([reply](https://x.com/poteto/status/2114619779080237331)): she quotes "It's about how much you can constrain the environment toward the right behavior when you have a large, heterogeneous mix of collaborators" and adds "right, exactly!". This is the same idea as "big company problems are now everyone's problems".
- The talk transcript is in `raw/transcripts/ron-minsky-jane-street-reliable-software-age-of-agents.txt`.

**[Chief]**: for Sam's React/TS area, this means:

- inline snapshot tests (`toMatchInlineSnapshot`) of reducer output and rendered trees
- stricter types in the folders he owns
- a check that agents don't delete or skip tests

See [applying-at-microsoft.md §7](applying-at-microsoft.md#7-ideas-from-ron-minskys-talk-applied-chief) and `ai-friendly-environments/tests.md`.

### 2. Languages for agents and formal verification (23 and 26 Oct)

- **23 Oct 02:20 BST** ([reply](https://x.com/poteto/status/2113440410442072232)): "very hard problem but hopefully we will see more innovation in formal verification (+ keeping code/spec in sync, ideally in same lang like @bendlang)".
- **26 Oct 06:43 GMT** ([quote](https://x.com/poteto/status/2114608724312752550)): quoting @mattpocockuk, who wrote that the next "language for agents" should be "As fast as Rust", have "As little design space as Go" and "Have the strictest type/verification system ever written". Her comment: "i am really excited to see all the innovation that's going to happen with programming languages in the next few years".
- **26 Oct 06:53 GMT** ([reply](https://x.com/poteto/status/2114611298222875042)): someone asked whether new languages are needed at all. Her prediction is yes: "there are decades of research into compiler backends like llvm, gcc, cranelift, etc that i don't think will just go away … i could certainly see new system languages with interesting properties and less high level semantics being more popular since agents make writing such code less painful".
- **26 Oct 07:02 GMT** ([reply](https://x.com/poteto/status/2114613597515190666)): "i think we're still really early … i think Bend is very promising … in terms of production readiness i think the closest thing you might have for a strict and somewhat verifiable language for agents is rust + something like verus, but that's also not complete".
- **26 Oct 07:28 GMT** ([reply](https://x.com/poteto/status/2114620076494311796)): "the Jane Street folks are doing interesting things with OxCaml and were also interested in formal verification".
- **pstack**: the statechart skill she announced on 22 Oct ("will release soon") is now in pstack as `/statechart`. The repo commit is "bring the statechart skill up to date, with the Pele renderer", dated 23 Oct 20:37 BST. It turns a TLA+ model into a Mermaid statechart where each bug is a numbered path, and can also go from an agreed chart to a TLA+ skeleton. See [tooling.md](tooling.md#formal-verification-and-statecharts).

### 3. Skills keep shrinking, and guidance should be balanced (24 Oct)

- **21:58 BST** ([reply](https://x.com/poteto/status/2114099131845423142)): "i am constantly updating and simplifying pstack. the more capable models get, the less instructions they need. over time i expect the skills to shrink more and more, until they're basically just saved prompts".
- **21:42 BST** ([quote](https://x.com/poteto/status/2114095305910280363)): "wrote about this in my pstack guide!", quoting @rauchg:

  > There'll be times where you over-guide the AI. It knows better than you and is more intelligent than you.
  >
  > There'll be times where you under-guide the AI. It can go off-track, have the wrong biases, or miss context.

  The guide is at <https://x.com/poteto/article/2097732320606507506>.

### 4. Bots as teammates, and keeping costs down (23–24 Oct)

- **24 Oct 20:07 BST** ([post](https://x.com/poteto/status/2114071326411690209)): "one of my favorite things to do is to have our bots collaborate with each other! just add your bots to slack and work alongside them like teammates".
- **23 Oct 04:57 BST** ([reply](https://x.com/poteto/status/2113479806952276140)), on bot usage costs: "ask your bot to check for expensive routines, reduce bot 2 bot messages. usually its the routines though that add up quickly". **[Chief]**: this matters for Sam's `bots/` design. The router should dedupe triggers, and routines should be cheap by default.
- **24 Oct 02:20 BST** ([reply](https://x.com/poteto/status/2113802710248288641)): "i love projects so much! i'm up to 27 right now". That's up from 16 parallel Projects on 10 Oct.
- She routes feedback and bugs by tagging her bot in replies: "@bot repro and fix this in my X Feedback project" ([25 Oct](https://x.com/poteto/status/2114402021461860430)), and "@bot send this to my silicon project to review" ([25 Oct](https://x.com/poteto/status/2114141783735329119)). This is the same "first mile → last mile" loop.

### 5. Code vs spreadsheets (26 Oct, minor)

- **06:10 GMT** ([reply](https://x.com/poteto/status/2114600632703459740)): "i think excel is interesting because you see the data and the functions are hidden, while in coding you see the functions but the data is hidden". This connects to expect tests, which make the data visible.

### 6. Points from the live-session repost not captured before (28 Oct)

@akarixbt reposted her hour-long live session ([post](https://x.com/akarixbt/status/2114389035388989873)) with hype she doesn't say ("50+ agents", "97% of engineers", "$750K offers"). Most of it is already in [core-principles.md](core-principles.md). New here:

- **"Benny", a bug-repro cloud agent.** It picks up bug reports, spins up its own cloud desktop running the app, reproduces the bug with her control skills (or confirms it's already fixed on `main`), and attaches a screen recording.
- **Non-engineers ship code.** PMs use Grok Bot to summarise what engineers landed overnight. PMs and designers fix bugs through it and she just "stamps" the PR. She treats this as proof the hard constraints work: they let non-experts contribute safely.
- **Cost framed as ROI.** She admits she has unlimited tokens at an AI lab, but argues the upfront token cost of refactoring towards hard constraints is cheaper than a "10,000 person engineering org" and its planning overhead. The goal is a codebase where "the most naive, dumbest" agents succeed. She also cites the 600+ PRs it took to move Grok Bot onto Dune.
