# Hooks and scripts

The same checks run in three places, so an agent meets them as early as possible:

1. **Copilot `preToolUse` hook**: before the agent runs a command or edits a file
2. **git pre-commit**: before a commit exists
3. **Azure Pipelines PR build**: before merge. This is the one that can't be skipped.

`/correct`: "Run the same command locally and in CI." **[Chief]** All the wiring below is Chief's proposal.

## The scripts

### `scripts/check-agent-gaming.mjs`

Node 20+, no dependencies. It reads a git diff and fails on:

- deleted test files (`*.test.*`, `*.spec.*`, `__tests__/`) and deleted `.snap` files
- test files renamed to non-test names
- net removal of `it(...)`/`test(...)` cases in a test file
- new `.only` / `.skip` / `xit` / `xdescribe` / `fit` / `fdescribe`, and in any `.py` file `pytest.mark.skip` / `pytest.mark.skipif` / `pytest.mark.xfail` / `pytest.skip(` / `pytest.xfail(`
- new `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`, `as any`, `as unknown as`
- any increase in `eslint-suppressions.json` counts, or a new entry
- `tsconfig*.json` lines that set a strict flag to `false`, or set `allowJs`/`skipLibCheck` to `true`

Any added line may instead carry an `agent-exception reason="…" expires=YYYY-MM-DD approver=<name>`, on the same line or the line above. Expired exceptions fail.

```sh
node scripts/check-agent-gaming.mjs --base origin/main --scope src/features/my-area
node scripts/check-agent-gaming.mjs --staged --scope src/features/my-area
node scripts/check-agent-gaming.mjs --format azure
```

Without `--base`, it uses `SYSTEM_PULLREQUEST_TARGETBRANCH` (set by Azure Pipelines in PR builds) and falls back to `origin/main`. It diffs from the merge base, so other people's changes on main don't count. Exit code 1 means problems were found. Messages name the fix, for example:

```
src/a.test.ts:2  New .only/.skip (or xit/fit). Make the test pass or delete it with a human's approval; never skip or focus tests in a commit.
eslint-suppressions.json  New ESLint suppression: no-restricted-imports in src/x.tsx (0 -> 1). Fix the new violation; the baseline may only shrink (eslint --prune-suppressions).
```

Tests: `node --test scripts/`. They build throwaway git repos and check each case.

Limitations:

- It's line-based: a `.skip` spread over two lines, or a test deleted by moving it into a non-test helper, won't be caught.
- Paths are matched with forward slashes, which is what git outputs on Windows too.

### `scripts/copilot-pretooluse-guard.mjs`

A Copilot hook script. It reads the hook payload on stdin and prints `{"permissionDecision":"deny","permissionDecisionReason":"…"}` to block a tool call, or prints nothing to allow it.

It denies:

- `git commit --no-verify` / `-n`
- force pushes
- `git reset --hard`
- `git clean -f`
- `eslint --suppress-all/--suppress-rule`
- `vitest`/`jest -u`
- deleting test files
- any edit or create on guard config:
  - `eslint.config.*`, `eslint-suppressions.json`, `tsconfig*.json`
  - `.github/hooks/`, `.githooks/`
  - `azure-pipelines*.yml`
  - the two scripts themselves

It accepts both payload shapes: Copilot's camelCase `{ toolName, toolArgs }`, where `toolArgs` is a JSON string, and the VS Code-compatible `{ tool_name, tool_input }`. Shell tools are recognised by a `command` argument and file tools by `path`. That avoids depending on exact tool names, which differ between surfaces (for example, `bash` vs `powershell`).

## Copilot hooks

Copilot reads repository hooks from `.github/hooks/*.json`. Per the [hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference):

- the Copilot CLI also reads user-level hooks from `~/.copilot/hooks/` (`%USERPROFILE%\.copilot\hooks\` on Windows) and policy hooks
- the Copilot cloud agent runs the `bash` entry inside its Linux sandbox
- `preToolUse` output can be `allow`, `deny` or `ask`

`examples/copilot/agent-guard.json`, which goes in `.github/hooks/agent-guard.json`:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "node scripts/copilot-pretooluse-guard.mjs",
        "powershell": "node scripts/copilot-pretooluse-guard.mjs",
        "cwd": ".",
        "timeoutSec": 10
      }
    ]
  }
}
```

Notes:

- Hooks run on every tool call. Keep the script fast: no network and no `npm` start-up.
- In headless runs (`copilot -p …`), `ask` has nobody to answer it, so use `deny` for anything risky.
- The hook is the place for a second-model "auto-review" of commands. See the bots design in `../poteto-advice/compilation/applying-at-microsoft.md`. Keep the deterministic denies in this script, and treat any model-based review as an extra layer, not a replacement.
- Hooks cover what the agent does. They do nothing for a human pushing a commit, which is why the pre-commit hook and the PR build exist too.

## git pre-commit

`examples/githooks/pre-commit`:

```sh
#!/bin/sh
set -e

node scripts/check-agent-gaming.mjs --staged --scope src/features/my-area

files=$(git diff --cached --name-only --diff-filter=ACMR -- 'src/features/my-area/*.ts' 'src/features/my-area/*.tsx')
if [ -n "$files" ]; then
  npx --no-install eslint --max-warnings=0 $files
fi
```

Install it without a dependency: copy it to `.githooks/pre-commit`, then run `git config core.hooksPath .githooks`. Git for Windows runs hooks with its bundled `sh`, so this works on Windows too.

- If the repo already uses husky or lint-staged, add the two commands there instead.
- Paths with spaces would need `-z` handling. That's not an issue in most TS repos.
- Agents can bypass hooks with `--no-verify`. The Copilot guard denies that, and the PR build is the backstop.

## Azure Pipelines PR checks

**Azure Repos ignores the YAML `pr:` trigger.** PR builds for Azure Repos come from a **build validation** branch policy on the target branch (Project settings → Repos → Policies → Branch policies → Build validation). So the pipeline sets `trigger: none` and the policy runs it on each PR.

`examples/azure-pipelines/pr-checks.yml`:

```yaml
trigger: none

pool:
  vmImage: ubuntu-latest

variables:
  SCOPE: src/features/my-area

steps:
  - checkout: self
    fetchDepth: 0

  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm ci
    displayName: Install

  - script: node scripts/check-agent-gaming.mjs --scope "$(SCOPE)" --format azure
    displayName: No deleted tests, .skip/.only or new suppressions

  - script: npx eslint "$(SCOPE)" --max-warnings=0
    displayName: Lint (owned folders, suppressions baseline applies)

  - script: npx tsc -p tsconfig.json --noEmit
    displayName: Type check

  - script: npx vitest run "$(SCOPE)" --allowOnly=false
    displayName: Tests
```

- `fetchDepth: 0` matters. New pipelines default to a shallow fetch, and the script needs the merge base with the target branch.
- `--format azure` emits `##vso[task.logissue …]` lines, so problems show up as errors on the build summary, with file and line.
- In a huge monorepo, use your repo's existing CI templates and add only the script step. Mark it as required in the branch policy, scoped with a path filter to your folders. Build validation policies support path filters.
- To show results as PR comments as well, a step can post a thread through the ADO REST API with `System.AccessToken`. That isn't included, as it's a write to ADO.

## Make agents run the checks themselves

Put the commands in your repo instructions, so the agent runs them before saying it's done:

```md
Before you finish: run `node scripts/check-agent-gaming.mjs --base origin/main --scope src/features/my-area`, `npx eslint src/features/my-area`, `npx tsc --noEmit`, and the tests for the files you changed. Fix what they report; do not suppress.
```

This is prose, the lowest level of the pyramid, but the checks it points to are deterministic and enforced again in CI.
