---
name: check-traits
description: Review the current diff against the repo's traits in .agents/traits/ and report where a trait is ignored. Read-only. Run only when I type /check-traits.
disable-model-invocation: true
---

# /check-traits (draft, untested)

Read-only. Never edit files, stage, commit or push. Only report.

## 1. Load the traits
- Read every `.agents/traits/*.md`. Each has frontmatter `name`, `subject`, `requirement`, `purpose`, then optional context such as a before/after diff.
- If I name traits (`/check-traits no-derived-state-in-effects`), use only those.

## 2. Get the diff
- Default: `git diff --merge-base main` plus `git diff` for unstaged changes.
- If I give paths or globs, review those files' current contents instead.

## 3. Check
- For each changed file, keep only the traits whose `subject` applies to it.
- Judge each changed hunk against each applicable `requirement`, using `purpose` and the body to settle edge cases and "unless" clauses.
- Ignore anything a linter, the type checker or tests already enforce.

## Report
For each finding: trait name, file and line, what the code does, what the requirement asks for, and confidence (high / medium / low). Then list traits that seem too broad, too vague or in conflict with each other, as candidates to clarify or reconcile. If nothing needs attention, say so in one line.
