# Bun's CLAUDE.md (oven-sh/bun, read 27 Oct 2026)

- File: https://github.com/oven-sh/bun/blob/main/CLAUDE.md (239 lines, last changed in commit c643ea8 on 27 Oct 2026)
- Context: Bun is a large Rust and C++ runtime (~200 crates) where agents do a lot of the work. Branches must start with `claude/`.

## Summary
It's a short, practical agent guide to a big codebase. Most of it tells the agent which one command to use and what "done" means. Specialist knowledge is pushed out to separate docs (`REVIEW.md`, `.claude/docs/landing-prs.md`) that the agent reads only when they apply.

## Comment rules (Sam's favourite)
- "If you need a paragraph-long comment to justify why the workaround is OK, the code is wrong — fix the code."
- "After every code comment you write, ask yourself, 'Is this information the next Claude would spend multiple tool calls trying to understand?' If the answer isn't clearly yes, the code comment is noise - delete it."
- Why it works: it gives the agent a test it can apply itself, not a vague "comment sparingly". The audience is the next agent, and the cost is tool calls. A long justification counts as evidence the code is wrong, not as documentation.
- Fits our no-comments stance, but allows the rare comment that actually saves the next agent real exploration.

## Other patterns worth copying
- **One path to run things.** `bun bd` builds and runs the debug build; "never use `bun test` directly" because it would test the wrong binary. Exceptions are written out explicitly, with the reason (type-only `.d.ts` changes).
- **Prove the test.** A test is only valid if it fails with the system Bun (`USE_SYSTEM_BUN=1`) and passes with the debug build, so it fails before the fix and passes after.
- **Banned test patterns.** No sleeps or timeouts to wait for conditions ("you are testing the CONDITION, not TIME PASSING"), always `port: 0`, no public internet, no "check output has no panic" tests (they never fail), a time budget per test and per file, and assert stdout before the exit code for better failure messages.
- **Where tests go.** Add to the existing test file for the module, don't make new files. Regression files only for real regressions with a real issue number.
- **Honesty rule.** "NEVER overstate what you got done or what actually works."
- **Stopping wrong root causes.** A specific known false explanation ("it's the conservative stack scanner") is banned unless proven with two named artifacts. This turns a debugging rabbit hole the agent keeps falling into into a rule with an evidence bar.
- **Review rules from history.** `REVIEW.md` is distilled from ~2,500 merged PRs; situational docs are loaded only for the relevant work (compat, API design, perf, cross-platform, deps, docs, PR process).
- **Wrapper scripts beat raw tools.** `bun run ci:errors`, `ci:status`, `pr:comments` exist because `gh` misses comments after 100 and the GraphQL API confuses agents. And: if the wrapper output looks wrong, fix the wrapper, don't work around it.

## Takeaways for us
- Add the two comment rules almost word for word to our instructions (Copilot instructions or a trait), replacing "Claude" with "agent".
- Add the "fails before, passes after" check to the test rules; in Python that means running the new test against the parent commit.
- Turn repeated agent mistakes into specific named bans with an evidence bar, like the stack-scanner rule. That's poteto's `/correct` and traits in action.
- Distil review rules from our own merged PRs into a REVIEW.md, and keep situational docs out of the always-loaded file.
- Wrap flaky or confusing tools (ADO CLI, PR comments, CI logs) in scripts with one obvious command each.
