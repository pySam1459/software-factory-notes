# Tooling: pstack, verification and agents

- Source: <https://github.com/cursor/plugins/tree/main/pstack> (MIT, © 2026 Lauren Tan)
- Guide: <https://x.com/poteto/article/2097732320606507506>. The repo copy is under `pstack/docs/guide/`, chapters `01-setup` to `10-recipes-and-pitfalls`.
- The skill list below is taken from the repo on 26 Oct 2026.

## What pstack is

[15 Oct](https://x.com/poteto/status/2110757066709356851):

> try pstack! it's my personal set of skills for rigorous and autonomous engineering with agents. it's updated frequently as I continue to tune and simplify them
>
> 10 second tutorial:
> 1. run /setup-pstack and choose your budget
> 2. add /poteto-mode in front of any prompt you want done rigorously
> 3. ask /poteto-help whenever you're unsure what pstack skills to use
> 4. that's it!

It installs as a Cursor plugin and is also available for Grok Bot. Points from her replies:

- "you don't have to use /poteto-mode for everything - just your hardest tasks that need the most rigor" ([15 Oct](https://x.com/poteto/status/2110534523389943974))
- "pstack skills all have disable-model-invocation: true so they don't get auto injected into every session, so there's no token cost to installing it" ([15 Oct](https://x.com/poteto/status/2110760668987322408)). In the 26 Oct repo, `setup-pstack` is the one skill without that flag.
- "both of our skill plugins work great together" ([2 Oct](https://x.com/poteto/status/2106134336705843554)), meaning hers and Matt Pocock's.

## `/setup-pstack`

This detects the models you have and asks for a budget: `unlimited`, `large`, `medium` or `small`. Each budget maps to a reasoning effort, from `max` down to `medium`. It then writes `~/.cursor/rules/pstack-models.mdc`, "an always-applied rule that sets pstack's model per role". Example roles include arena runners, architect runners, interrogate reviewers and swarm workers, and the rule overrides the skill defaults. `inherit-parent` or `auto` makes a role use the chat's model. Run it again when your models change.

## `/poteto-mode`

This is "poteto's agent style for concise, detailed responses, deliberate subagents, unslopped prose, simple code, and verified work". Its non-negotiables include:

- **Principles named**: "name each principle that shaped a decision and the specific choice it changed. Cite only principles whose leaf SKILL.md you read this session." This is where the "Principles Named" section in replies comes from.
- **Don't ask what you could measure.** If the answer to a "which approach" question "is a fact you could observe by running something … it is not the human's to answer. Sketch it via the Prototype playbook … and let the result decide."
- **Name the data shape first** for any code. Use `/architect` for code that crosses a function boundary.
- **Before commit**, run `/deslop` from `cursor-team-kit`. **Before review**, run `/no-comments`.
- **Shipping UI** uses the matching control skill (`control-ui`, `control-cli`). For bugs, reproduce first on the same surface.
- **Bugbot comments**: "skeptical posture. They catch real bugs and also file non-issues and nitpicks".
- **Long or unattended work** keeps a decision trail with `/show-me-your-work`.
- **Playbooks** cover Prototype, Babysit, Shipping, Feature, Bug fix, the eval playbook, and others.

## `/correct` in detail

Shipped in 0.15.9 ([4 Oct](https://x.com/poteto/status/2106542593656111276)): "if you keep correcting agents for the same mistakes, it finds the pattern and fixes it with architecture, types, and checks." The full text is in [`../raw/pstack/correct-SKILL.md`](../raw/pstack/correct-SKILL.md). Its steps:

1. **Its model of the agent:** "Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles."
2. **Find mistake classes.** Read recent commits, reverts, review comments, agent instruction files, and "comments that explain workarounds". "A class counts once it has happened twice."
3. **Fix each class at the highest level that works:**
   1. architecture: one owner per piece of state, one supported way, hidden internals, one source of truth, delete old ways
   2. types, "so the bad state can't be written"
   3. a lint or CI check "whose error names the file, type, or function to use instead". "If the pattern is already common, fail only when a change adds more."
   4. behaviour tests: fix or delete tests that pass when the behaviour breaks or fail when only internals change
   5. "Write docs or agent rules last, only for judgment calls. Nothing fails when an agent skips them."
4. **Prove it.** "Prove each new check fails on a real past mistake. Run the same command locally and in CI. Exceptions go on the offending line with a reason, an expiry date, and a human's approval."
5. **Keep a rule table** in the agent instruction file that pairs each rule with what enforces it. "If the rule was already there and nothing enforces it, that's a repeat … Drop a rule once its mistake can't happen."
6. **Reply** with "each class with its evidence, the level you picked, and why a higher level didn't work."

A Copilot port is in `../../ai-friendly-environments/copilot-skills/correct/SKILL.md`. The exception syntax and the "fail only when a change adds more" ratchet are implemented in `../../ai-friendly-environments/scripts/check-agent-gaming.mjs` and in ESLint bulk suppressions.

## Principle skills

[14 Oct](https://x.com/poteto/status/2110496830429839869): "very concise skills (~10-20 loc) that distill down good practices into its core". Each one is `principle-<name>`, and `/poteto-mode` loads them on demand. There are 24 as of 26 Oct:

| Area | Principles |
|---|---|
| Design | attack-the-premise, redesign-from-first-principles, foundational-thinking, exhaust-the-design-space, model-the-domain, subtract-before-you-add, experience-first |
| Code | type-system-discipline, boundary-discipline, encode-lessons-in-structure, make-operations-idempotent, separate-before-serializing-shared-state, migrate-callers-then-delete-legacy-apis, minimize-reader-load |
| Verification | prove-it-works, test-behavior-not-implementation, explain-the-number, sequence-verifiable-units, fix-root-causes |
| Working style | never-block-on-the-human, outcome-oriented-execution, laziness-protocol, guard-the-context-window, build-the-lever |

The guide's principles chapter is copied in [`../raw/pstack/08-principles.md`](../raw/pstack/08-principles.md).

## All skills (26 Oct 2026)

| Skill | What it does (from its description) |
|---|---|
| `/architect` | Sketch types, signatures and module structure before code, then stay in the loop. Since 0.15.9 it has instructions for agent-friendly architecture. |
| `/arena` | N parallel candidates; pick a base, graft the best parts of the losers |
| `/automate-me` | Draft or revise a personal `-mode` skill from your preferences |
| `/benchmark-checklist` | Vet a perf measurement before reporting it (based on Brendan Gregg's checklist) |
| `/blast-radius` | What could this change break beyond the diff, proven by running real code |
| `/bro` | Restate the last message in plain language. Her most used: "/bro catch me up on everything since my last message, and if there are any action items for me give me enough context (exec summary) to make a call" ([10 Oct](https://x.com/poteto/status/2109024196760305861)) |
| `/correct` | See above |
| `/create-verification-skill` | Generate a project-local skill that "drives your app the way a user does" |
| `/maintain-verification-skill` | A periodic pass that "keeps a project's verification skill and feature map honest" |
| `/create-formal-verification-skill` | Generate a skill that formally verifies "the code where a bug costs the most and tests reach the least" (TLA+, kani, …). Beta since v0.15.27 ([18 Oct](https://x.com/poteto/status/2111926622278521253)) |
| `/maintain-formal-verification-skill` | Bring models and properties back in line after code changes |
| `/statechart` | A Mermaid statechart from a TLA+ model; each bug is a numbered path to a state that breaks a rule. Also chart → TLA+ skeleton. Updated 23 Oct: the commit reads "bring the statechart skill up to date, with the Pele renderer". |
| `/figure-it-out` | An auditable playbook for big migrations or work reviewed later |
| `/how`, `/why`, `/teach` | Walkthroughs, design rationale from evidence (it discovers MCPs: source control, issue tracker, docs, chat), plain explanations |
| `/in-your-own-words` | "Restate in your own words what you think the user's goals are and what problem they're trying to solve" |
| `/interrogate` | Multi-model adversarial review |
| `/ketchup`, `/ketchup-video` | Catch up on what changed, listing what's waiting on you |
| `/make-bot-ui` | UI for bots |
| `/no-comments` | "Spawn Comment Sicko, fix accepted findings, and offer encodings for claimed constraints." It keeps comments about things "we cannot change". For constraint comments ("do not remove") it offers the cheapest type, runtime, test or lint encoding, then deletes the comment. |
| `/poteto-help`, `/poteto-mode`, `/setup-pstack` | See above |
| `/recall` | Reconstruct working context from your chat history, live state and shared record |
| `/reflect` | Three reviewers over the transcript; route learnings to skill edits |
| `/sharpen` | "Make a task deeper, not bigger, then rewrite the prompt." |
| `/show-me-your-work` | A TSV decision log for unattended work |
| `/swarm` | Fan out N workers, return one report |
| `/tdd` | Only when asked or when there's a cheap local test target |
| `/technical-writing`, `/unslop` | Docs standard; cut AI tells |
| `/typescript-best-practices` | Path-scoped to `**/*.ts(x)`: discriminated unions, branded types via verifying guards ("never from `as`"), `unknown` over `any`, schemas before guards, `satisfies`, exhaustiveness, object args, real tests, no `console.log` |

## Verification skills and Chrome DevTools

From the talk and live session:

- Her first weeks on Cursor's agent window were spent hand-reading Chrome DevTools traces with an agent that "would like confidently state like it's this thing", and it wasn't.
- The fix was a verification ("control") skill. Its CLI lives in the skill directory and drives the Electron or React app over the Chrome DevTools protocol: clicks, keyboard, screenshots, CPU traces, heap snapshots. A **feature map** sits alongside it (see [core-principles §7](core-principles.md#7-feature-maps)).
- The output is an **artefact for the reviewer**: "most commonly this would be a video and/or screenshots for UI work" ([12 Oct](https://x.com/poteto/status/2109436202554372476)).
- `/create-verification-skill` generates one for any stack. `cursor-team-kit` ships generic `control-ui` and `control-cli`.

Off-the-shelf equivalents to look at **[Chief]**:

- the **Chrome DevTools MCP server** (`chrome-devtools-mcp`): navigation, input, screenshots, performance traces, console and network
- **Playwright MCP** and Playwright tests
- **Playwriter** (from Sam's bookmark of [@__morse](https://x.com/__morse/status/2112954960627536111))

For Electron you can attach to `--remote-debugging-port`.

## Formal verification and statecharts

- **`/create-formal-verification-skill`** ([18 Oct](https://x.com/poteto/status/2111926622278521253)): "a meta-skill that creates a new skill and formal verification suite". Examples: TLA+ for state machines and concurrency, kani in Rust for undefined behaviour. "i've been experimenting with modeling our code with TLA+ and have already found several bugs".
- **Statecharts** ([21 Oct](https://x.com/poteto/status/2112736749281759566), [22 Oct](https://x.com/poteto/status/2113398433977659654)): render TLA+ models as statecharts a PM or reviewer can read. Built with Pele by @kepano. The released skill (`/statechart`) works both ways:
  - `from-spec`: TLA+ → chart
  - `from-chart`: an agreed chart → TLA+ skeleton, then check the code against it

  Its first run installs TLC and Java with mise (about 305 MB).
- Long term, she is betting on languages where proofs live with the code (Bend; Rust + Verus). See [new-since-2026-10-23.md](new-since-2026-10-23.md).

## Evals for skills

From the live session (details in [core-principles §8](core-principles.md#8-short-skills-tested-with-evals)): coordinator plus rubric, neutrally named sub-agent directories, a cross-model judge, loop to 10/10. Packaged as the eval playbook under `/poteto-mode`. Quick start: "/poteto-mode create a skill that does <xyz> and eval it" ([15 Oct](https://x.com/poteto/status/2110759504778592664)).

## Grok Bot, cloud agents and team bots

- **Projects in parallel**: "i have so many cursor Projects running in parallel (16 right now)" ([10 Oct](https://x.com/poteto/status/2109024196760305861)).
- **First and last mile** ([6 Oct](https://x.com/poteto/status/2107510472601985336)):
  - connect apps, then add routines on a schedule or on events
  - hand coding to cloud agents
  - build loops, e.g. Slack feedback → Linear ticket → a cloud agent triages and reproduces it
- **Release and QA bots** ([6 Oct](https://x.com/poteto/status/2107527180263829827)): "sandcastle", her release manager bot, DMs contributors, kicks off the build and starts "an automated fuzz swarm … 10+ agents … using our verification skills and feature map". It then @-mentions her engineer bot to triage and fix.
- **Agentic risk-assessed review** ([8 Oct](https://x.com/poteto/status/2108283057581195413)): "low-medium risk ones don't require a review so you just merge it. also bugbot of course".

For how this maps onto GitHub Copilot and ADO, see [applying-at-microsoft.md](applying-at-microsoft.md).
