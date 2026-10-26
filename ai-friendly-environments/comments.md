# Banning comments

## The argument (poteto)

From the talk "How I shipped 2000 PRs": "agents were just using the comments around the code as justification for why it wasn't going to solve the actual problem. And instead paper over it with a band-aid or a short-term solution. So, in Dune … we made the choice to actually ban comments".

On X, 13 Oct ([post](https://x.com/poteto/status/2110149626133438732)):

> ban and delete most if not all code comments!
>
> agents love copying what already exists. a seemingly harmless comment explaining some temporary workaround is one of the worst viruses you can have in your codebase. like a weed it'll spread quickly as a tool for agents to quickly get their job done.

Her follow-up reasons ([14 Oct](https://x.com/poteto/status/2110214162400137637)):

- "comments go stale very quickly and confuse agents and people"
- "they are often used by agents to explain workarounds that would've been better off actually fixing the code instead"
- "they are not enforceable and waste your agents' tokens"

On a `// don't use this` comment ([15 Oct](https://x.com/poteto/status/2110635971884802049)): "nothing actually enforces that that function isn't used. a lint rule, or even better deleting that API is far more effective!"

From the live session, on why agent comments in particular: "99% of the time agents just write code comments that kind of describe some historical thing that is actually totally irrelevant to the code. Um like it will often say like you know oh Lauren said you should never do this".

"Most if not all" is deliberate. Her `/no-comments` skill keeps "the ones that actually should exist (like explaining a browser quirk)".

## What replaces a comment

| The comment was… | Replace it with |
|---|---|
| Explaining what the code does | Better names, or extract a well-named function |
| `// TODO` / `// FIXME` | An ADO work item. Delete the comment. |
| `// don't call this, use X` / `@deprecated` | Delete the API, or a `no-restricted-imports`/`no-restricted-syntax` rule whose message names X |
| `// must be called after init()` | Make the wrong order impossible: `init()` returns the object you call it on |
| `// can be null when …` | A type: `T \| null`, or a discriminated union |
| `// workaround for …` | Fix the root cause, or an ADO bug linked in the commit message |
| Explaining a platform or browser bug you can't fix | Keep it, with a link: `// quirk: https://bugs.chromium.org/…` |
| Explaining why a test exists | The test name |

Git history keeps the "why": poteto likes small atomic PRs because "the git history is a very rich source of context" (live session).

## Lint rule **[Chief]**

ESLint has no built-in rule that bans all comments. `no-warning-comments` only covers TODO/FIXME. So `examples/eslint-rules/no-comments.mjs` is a small local rule:

- It reports every comment except an allowlist:
  - `eslint-disable/enable` directives (which must carry an `agent-exception`)
  - `global`
  - `@ts-expect-error` with an `agent-exception`
  - `@vitest-environment`
  - triple-slash references
  - `@license`
  - `#__PURE__`
  - `quirk: <url>`
- The message names the fix.
- Extra allow patterns can be passed as options.
- JSDoc counts as a comment and is reported. If you publish a library whose JSDoc feeds generated docs, add an allow pattern such as `'^\\*'` for those folders only.

Wiring (from `examples/eslint.config.mjs`):

```js
import noComments from './eslint-rules/no-comments.mjs';

{
  files: ['src/features/my-area/**/*.{ts,tsx}'],
  plugins: { local: { rules: { 'no-comments': noComments } } },
  rules: { 'local/no-comments': 'error' },
}
```

The rule is tested with ESLint's `RuleTester` in `examples/eslint-rules/no-comments.test.mjs`.

## Rolling it out on existing code

1. Turn the rule on for one folder, and baseline with `eslint --suppress-rule local/no-comments` so only new comments fail.
2. Run a cleanup pass. poteto's suggested prompt for her own setup was to spawn a swarm with `/no-comments` "and identify useless code comments we can prune in my repo. come back with a high level plan of which of these workarounds would be best solved by refactoring and which we can straight up delete". In Copilot, use a skill with the same job: delete the useless ones, and turn the workaround ones into ADO bugs or refactors.
3. Prune the baseline as the counts fall: `eslint --prune-suppressions`.
