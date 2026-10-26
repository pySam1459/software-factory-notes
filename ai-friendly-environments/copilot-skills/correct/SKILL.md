---
name: correct
description: Turn repeated agent mistakes in my owned folders into enforced checks. Run only when I type /correct.
disable-model-invocation: true
---

# /correct (Copilot + Azure DevOps)

Assume every contributor is an agent that only sees the files it opened, copies the nearest example, and takes the shortest path that compiles. Change the repo so the next agent cannot repeat the mistake.

Scope: only the folders listed in `.github/correct-scope.txt` (one path per line). Never touch code outside them.

## 1. Find mistake classes
- Read recent commits and reverts in scope: `git log --since=30.days -- <scope>` and `git log --grep=Revert -- <scope>`.
- Read my ADO PR review threads for the same period with the Azure DevOps MCP server (read-only mode), filtered to files in scope.
- Read instruction files (`copilot-instructions.md`, `*.instructions.md`, `AGENTS.md`) and workaround comments in scope.
- Group into classes. A class counts only once it has happened twice.

## 2. Fix each class at the highest level that works
1. Architecture: one owner per piece of state, one supported way per job, hide internals so the wrong import fails, delete legacy code an agent would copy.
2. Types: make the bad state unrepresentable.
3. Lint or CI check whose error message names the fix. If the pattern is already common, fail only on additions (diff against the PR target branch).
4. Tests on behaviour, not internals. Delete tests that still pass when behaviour breaks.
5. Instructions last, only for judgement calls.

## 3. Prove it
- One commit per class.
- Show each new check failing on a real past mistake from step 1.
- The same command runs locally and in the Azure Pipelines PR build.
- Exceptions go on the offending line with a reason, an expiry date, and a human approver.

## 4. Keep the rule table
Maintain a table in `.github/instructions/correct.instructions.md` (applyTo: the scope folders): rule | enforced by | added. When I correct the agent, add the rule. A rule that already existed with no enforcer is a repeat: move it up a level. Drop a rule once its mistake can no longer happen.

## Report
For each class: the evidence (commits, PR threads), the level chosen, and why a higher level would not work.
