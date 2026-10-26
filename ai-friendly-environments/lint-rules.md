# Lint rules and the ratchet

Lint is the third level of the pyramid. It is the main way to "stop the bleeding" (poteto) when a bad pattern is already widespread.

## Flat config

The full, tested example is [`examples/eslint.config.mjs`](examples/eslint.config.mjs). It was checked with ESLint 9.39, typescript-eslint 8 and @vitest/eslint-plugin 1.x. Its structure:

```js
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';
import noComments from './eslint-rules/no-comments.mjs';

const OWNED = ['src/features/my-area/**/*.{ts,tsx}'];

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', '**/*.generated.ts'] },
  { files: ['**/*.{ts,tsx}'], extends: [tseslint.configs.base] },
  {
    files: OWNED,
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { local: { rules: { 'no-comments': noComments } } },
    rules: { /* see the file */ },
  },
  { files: ['src/lib/hooks/useMountEffect.ts', 'src/lib/hooks/useSubscription.ts'], rules: { 'no-restricted-imports': 'off', 'no-restricted-syntax': 'off' } },
  { files: ['**/*.test.{ts,tsx}'], plugins: { vitest }, rules: { 'vitest/no-focused-tests': 'error', 'vitest/no-disabled-tests': 'error' } },
);
```

What it enforces:

| Area | Rules |
|---|---|
| Types | `no-explicit-any`, `ban-ts-comment`, `consistent-type-assertions`, `no-non-null-assertion`, `switch-exhaustiveness-check`, `strict-boolean-expressions`, plus the `strictTypeChecked` set |
| React | `useEffect`/`useLayoutEffect` banned via `no-restricted-imports` and `no-restricted-syntax` |
| Structure | `no-restricted-imports` `patterns` block `**/internal/**` and `**/legacy/**` |
| Comments | `local/no-comments` |
| Workarounds | `setTimeout` with no delay (usually a race-condition patch), and `as unknown` laundering |
| Tests | `vitest/no-focused-tests`, `no-disabled-tests`, `expect-expect`, `no-conditional-expect`, and `no-floating-promises` in tests |
| Directives | `reportUnusedDisableDirectives: 'error'`, so stale `eslint-disable`s fail |

**[Chief]** Scope the strict block to the folders you own (`OWNED`). The rest of the monorepo keeps its existing config. If the repo still uses `.eslintrc`, ESLint 9 can run the flat config for a sub-folder: put `eslint.config.mjs` in that folder and run ESLint from there. Or check what version your repo is pinned to before proposing a migration.

### `no-restricted-syntax` recipes

Each one names the fix:

```js
'no-restricted-syntax': ['error',
  { selector: "MemberExpression[object.name='React'][property.name=/^use(Layout)?Effect$/]", message: 'useEffect is banned. Use … (see react.md)' },
  { selector: 'TSAsExpression > TSUnknownKeyword', message: 'Do not launder types through `as unknown`. Parse the value at the boundary instead.' },
  { selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]", message: 'setTimeout without a delay is usually a race-condition workaround. Fix the ordering instead.' },
  { selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']", message: 'Use <SafeHtml> from src/lib/html, which sanitises.' },
  { selector: "CallExpression[callee.object.name='localStorage']", message: 'Use the typed storage helpers in src/lib/storage.' },
],
```

You can explore AST selectors at <https://typescript-eslint.io/play> (switch the AST viewer on).

Write a custom rule (like `no-comments.mjs`) only when a selector can't express the check. Test it with `RuleTester`.

## The ratchet: only new violations fail

poteto: "if you write a lint rule, you can at least stop the bleeding … it at least prevents it from growing" (talk). For "If the pattern is already common", `/correct` says "fail only when a change adds more".

### ESLint bulk suppressions (ESLint ≥ 9.24)

ESLint 9.24 added built-in bulk suppressions. This was tested with 9.39.

```sh
npx eslint src/features/my-area --suppress-all
npx eslint src/features/my-area --suppress-rule local/no-comments
npx eslint src/features/my-area
npx eslint src/features/my-area --prune-suppressions
```

1. `--suppress-all` (or `--suppress-rule <rule>` for one rule) writes `eslint-suppressions.json` with a count per file and rule for every existing violation.
2. A normal run then passes as long as each file/rule stays at or below its count. A **new** violation fails, even in a file that already had some.
3. When counts drop because violations were fixed, ESLint prints "There are suppressions left that do not occur anymore" and exits with code 2. That fails CI until you run `--prune-suppressions`, which shrinks the file. So the ratchet only moves one way. (`--pass-on-unpruned-suppressions` turns this off; don't.)

Commit `eslint-suppressions.json`. The ratchet then has two guards:

- `scripts/check-agent-gaming.mjs` fails a PR if any count in `eslint-suppressions.json` goes *up* or a new entry appears. Otherwise an agent can just re-run `--suppress-all`.
- The Copilot `preToolUse` hook (`scripts/copilot-pretooluse-guard.mjs`) refuses `eslint … --suppress-all/--suppress-rule` and edits to `eslint-suppressions.json`.

### Alternatives

- **Lint only changed lines.** Some teams lint only the PR diff. That is weaker: it lets a violation through if the agent moves code, and it doesn't measure progress.
- **`--max-warnings` per folder.** Coarse, but works on old ESLint versions.
- **`betterer`.** Snapshot-based ratchet for ESLint and `tsc` results. Useful for the TypeScript strictness ratchet, which ESLint suppressions don't cover.

## Migration PRs

Once the rule stops new violations, burn down the baseline with small agent PRs: one rule and one folder per PR, each one shrinking `eslint-suppressions.json`. pstack's principle "Migrate Callers Then Delete Legacy APIs" says finish the job and delete the old way, because a half-done migration leaves two patterns for agents to copy.

**[Chief]** A good routine is a scheduled Azure Pipeline that runs the Copilot CLI with "pick the largest entry in eslint-suppressions.json under my scope, fix it, open a PR". See `../poteto-advice/compilation/applying-at-microsoft.md`.
