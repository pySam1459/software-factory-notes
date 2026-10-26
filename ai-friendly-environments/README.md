# AI-friendly environments

A practical guide to making a codebase safe for agents to work in. The approach is to turn non-determinism into determinism: anything you would otherwise have to remember, review for or write in a prompt becomes architecture, a type, a lint rule, a test or a CI check. The agent is then restricted to the paths that are correct.

This is written for a large, legacy React/TypeScript codebase on Azure DevOps (ADO), with GitHub Copilot as the agent. Most of it applies elsewhere.

Compiled 2026-10-26 by Chief (Sam's Grok Bot).

## Where the ideas come from

- **poteto** (Lauren Tan, React compiler core team, Grok Bot at SpaceX AI). She came up with the inverse pyramid, the codebase as memory, banning comments and `useEffect`, "stop the bleeding" with lint rules, `/correct` and the exception rules (reason + expiry + approver). The sources are in the sibling repo `../poteto-advice`.
- **Ron Minsky** (Jane Street), in the talk "Now more than ever: building reliable software in the age of agents" (Bug Bash 2026). His points: expect tests, making illegal states unrepresentable, property tests and deterministic simulation, and formal methods getting cheaper.
- **Chief's own suggestions** are marked **[Chief]**. These cover the concrete Copilot/ADO wiring, the scripts, most of the config detail and the hygiene rules. Treat them as proposals, not as anyone's quoted advice.

## Contents

| File | What it covers |
|---|---|
| [principles.md](principles.md) | The inverse pyramid, turning rules into checks, error messages that name the fix, failing only on additions, exceptions, and a rule table |
| [typescript-strictness.md](typescript-strictness.md) | Strict tsconfig flags, discriminated unions, branded types, banning `as any` and `@ts-ignore` |
| [react.md](react.md) | Banning `useEffect` and what to use instead, allowed wrapper hooks, lint config |
| [comments.md](comments.md) | Why comments are banned, and the lint rule that does it |
| [lint-rules.md](lint-rules.md) | ESLint flat config, and the ratchet: suppressions baseline, only new violations fail |
| [tests.md](tests.md) | Expect/inline snapshot tests, fake timers and network, catching tests that have been gamed |
| [hooks-and-scripts.md](hooks-and-scripts.md) | Copilot `preToolUse` hooks, git pre-commit, Azure Pipelines PR checks, and the scripts in `scripts/` |
| [agent-config-hygiene.md](agent-config-hygiene.md) | Keeping instructions and skills few and focused, layering, auditing, pruning, picking one browser tool |
| [traits.md](traits.md) | Trait-driven development (traits.sh): small Markdown rules for judgement calls, checked by a model, and when to use them instead of lint or types |
| [copilot-skills/correct/SKILL.md](copilot-skills/correct/SKILL.md) | `/correct` adapted for Copilot and ADO |
| [copilot-skills/check-traits/SKILL.md](copilot-skills/check-traits/SKILL.md) | Draft read-only skill: review the diff against `.agents/traits/` |

## Working files

```
scripts/
  check-agent-gaming.mjs           diff checker: deleted tests, .skip/.only, new suppressions, loosened tsconfig
  check-agent-gaming.test.mjs      node --test
  copilot-pretooluse-guard.mjs     Copilot preToolUse hook: blocks --no-verify, force push, suppressing, editing guard config
  copilot-pretooluse-guard.test.mjs
examples/
  eslint.config.mjs                flat config: strict TS, useEffect ban, comment ban, vitest focus/skip
  eslint-rules/no-comments.mjs     custom rule (+ RuleTester test)
  hooks/useMountEffect.ts          the allowed effect wrappers
  hooks/useSubscription.ts
  tsconfig.strict.json
  githooks/pre-commit
  azure-pipelines/pr-checks.yml
  copilot/agent-guard.json         goes in .github/hooks/
  copilot/my-area.instructions.md  goes in .github/instructions/
  traits/                          example traits for a Python + TS project, go in .agents/traits/
```

Run the script tests with `node --test scripts/`. These need Node 20+ and git, with no dependencies. The ESLint example was checked with ESLint 9.39, typescript-eslint 8 and @vitest/eslint-plugin. Run the rule test with `node examples/eslint-rules/no-comments.test.mjs` from a project that has `eslint` installed.

## Start small **[Chief]**

1. Pick one folder you own and list it in `.github/correct-scope.txt`.
2. Add the pre-commit hook and the PR pipeline step with `check-agent-gaming.mjs`. These are cheap, and they stop the agent from weakening its own tests.
3. Turn on the ESLint rules for that folder, then run `eslint --suppress-all` once so only new violations fail.
4. Run `/correct` monthly on the same scope. Every repeated correction becomes a rule in the table.
