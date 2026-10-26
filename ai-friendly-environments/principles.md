# Principles

## 1. The inverse pyramid (poteto)

poteto, 16 Oct 2026 ([post](https://x.com/poteto/status/2111133080526495985)), on how to trust your agents' work more:

1. **Codebase improvements**: "better architecture, stronger types and invariants, clear boundaries. agents love to copy what exists and take the shortest path, so make the easy thing the right thing. categorically eliminate problems through code and you won't need to think about it again."
2. **Static analysis**: "lint rules, tests, CI, verification (eg TLA+). very token efficient ways to catch issues ahead of time."
3. **Prose**: "comments, rules, AGENTS.md, skills - anything that can't be enforced and requires agent judgment. use it minimally".
4. **Human review**: "the hardest to scale … spend that effort on the highest leverage point, designing an environment where agents do the right thing by default."

"this forms an inverse pyramid: you want most of your effort at the top, least at the bottom."

The order used in this guide is architecture > types > lint/CI > tests > prose > human review. pstack's `/correct` skill uses the same ordering: architecture, then types, then a lint whose error names the fix, then a behaviour test, and docs last.

Why it works, in her words from the "How I shipped 2000 PRs" talk: "the code base is really like the best form of memory because agents love to extend existing patterns that they see." The reverse also holds: "if you have existing anti-patterns … these will spread kind of like a virus."

## 2. Turn every rule into a check

If a rule can be broken without anything failing, an agent will eventually break it. poteto: "I would turn architectural rules into deterministic lint rules or construct the types so there's only one way to do something. Far more effective and token efficient than just prose, which can and will be ignored and go stale" ([14 Oct](https://x.com/poteto/status/2110205947079721252)).

Her `/correct` skill states the working assumption: "Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles."

To move a rule up the pyramid, ask these questions in order:

| Question | If yes |
|---|---|
| Can the wrong thing be made impossible to write? (delete the old API, hide internals, one owner per piece of state) | Architecture |
| Can the type system reject it? | Types ([typescript-strictness.md](typescript-strictness.md)) |
| Can a syntax pattern or an import detect it? | Lint ([lint-rules.md](lint-rules.md)) |
| Is it about behaviour? | A test, or a CI check ([tests.md](tests.md)) |
| None of the above (a judgement call) | Instructions, kept short |

## 3. Error messages name the fix

`/correct` asks for "a lint or CI check whose error names the file, type, or function to use instead." An agent reads the error and does what it says. "useEffect is banned" leads to a workaround. "useEffect is banned; use `useMountEffect` from `src/lib/hooks`, derive during render, or use TanStack Query" leads to the right code. Every `message` in `examples/eslint.config.mjs` follows this pattern.

## 4. Stop the bleeding: fail only on additions

poteto's talk: "whenever you see tech debt or bad patterns, your instinct should be I need to write a lint rule against it. You don't always have to clean up immediately because if you write a lint rule, you can at least stop the bleeding." And on X: "the deprecation comment is not enforced, and agents will continue propagating the pattern everywhere else … you cannot stop the bleed with a comment" ([14 Oct](https://x.com/poteto/status/2110164056422465845)). "a lint rule is far more effective and actually enforceable. and then of course you should actually finish that migration" ([14 Oct](https://x.com/poteto/status/2110162994869227719)).

In a large legacy codebase you cannot fix every existing violation before turning a rule on. So:

1. Turn the rule on.
2. Record the existing violations as a baseline (ESLint's `eslint-suppressions.json`, see [lint-rules.md](lint-rules.md)).
3. CI fails on any *new* violation, and on any growth in the baseline (`scripts/check-agent-gaming.mjs`).
4. Send migration PRs that shrink the baseline. Agents are good at this kind of mechanical work, and the baseline count shows progress.

This matches pstack's "Migrate Callers Then Delete Legacy APIs" principle: migrate and delete in one wave, rather than leaving both ways around for agents to copy.

## 5. Exceptions: reason + expiry + approver

From `/correct`: "Exceptions go on the offending line with a reason, an expiry date, and a human's approval."

The format used by the scripts and lint rule here **[Chief]**:

```ts
// eslint-disable-next-line no-console -- agent-exception reason="ops dashboard scrapes this log" expires=2026-12-31 approver=sam
console.log(startupSummary);
```

- `check-agent-gaming.mjs` lets an added suppression through only if it, or the line above it, has a valid `agent-exception`, and fails once the date has passed.
- The `local/no-comments` rule rejects `eslint-disable` comments that have no `agent-exception`.
- Your ADO branch policy decides who the approver can be: the PR must be approved by that person. A pipeline can check that the approver named in the exception matches an approver on the PR through the ADO REST API. That is a possible next step and not included here.

## 6. Keep a rule table

`/correct` maintains a table that pairs each rule with what enforces it: "If the rule was already there and nothing enforces it, that's a repeat, so fix it at the highest level in the same change. Drop a rule once its mistake can't happen."

Example (see `examples/copilot/my-area.instructions.md`):

| Rule | Enforced by | Added |
|---|---|---|
| No `useEffect` / `useLayoutEffect` outside `src/lib/hooks` | `no-restricted-imports`, `no-restricted-syntax` | 2026-10 |
| No code comments (except `quirk: <link>`) | `local/no-comments` | 2026-10 |
| No `any`, `@ts-ignore`, `as unknown as` | typescript-eslint, `no-restricted-syntax` | 2026-10 |
| No `.only`/`.skip`, deleted tests or new suppressions | `check-agent-gaming.mjs` in pre-commit and the PR build | 2026-10 |
| Features live in one folder, imported only through `index.ts` | `no-restricted-imports` patterns on `**/internal/**` | 2026-10 |
| Renderer code may not import main-process code | import-boundary lint (poteto's Dune does this for Electron) | — |
| Prefer extending an existing component | *nothing: judgement call, stays in prose* | 2026-10 |

A row whose "Enforced by" column says nothing is the next thing to fix.

## 7. Design for the dumbest agent

poteto (live session, CI chapter): the framework is "designed again for you know like the dumbest agent … one of the key principles I have for this framework is like the shortest the shortest path is the best path." And: "it's actually very annoying to write code in in [Grok Bot] but like agents absorb all of that annoyance."

Practical forms of this:

- **One paved path per job.** "there should be one conventional way to do some things. So that agents don't really need to guess" (talk).
- **Co-locate a feature in one folder**, so the agent doesn't have to search around (live session).
- **Enforce boundaries through the import graph.** Grok Bot keeps Electron main-process and renderer code in separate directories, and CI checks the import graph so neither can import from the other (live session).
- **Delete the legacy code** an agent would otherwise copy.

## 8. Measure readiness

poteto's suggested measures ([7 Oct reply](https://x.com/poteto/status/2107923381001781362)):

- % of agent-written code that gets merged
- revert / rework rate
- number of human messages per accepted PR (fewer is better)

There is also her "time to rewrite" thought experiment: how long would a fully hands-off rewrite take, and would you trust the result? See the [7 Oct post](https://x.com/poteto/status/2107913381751730352).

**[Chief]** On ADO, you can get the first two from the PR and commit APIs for PRs that carry a label such as `agent`. The third comes from counting your comment threads per PR.
