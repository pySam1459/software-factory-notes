---
title: "Short plain title (@handle)"
date: YYYY-MM-DD            # date of the source post or talk, Europe/London
source: https://x.com/handle/status/0000000000000000000
author: "@handle"           # X handle; add more as a list if needed
tags: [verification]        # pick from the list below
status: current             # current | superseded | archived
---

<!--
How to use this template
- File name: YYYY-MM-DD-handle-slug.md, handle as written on X, in the folder that fits:
  reading-notes/ (default), poteto-advice/ (@poteto or pstack), ux/, formal-verification/,
  agent-design/ (Sam's own bot or orchestration design). Evergreen guides go in
  ai-friendly-environments/ without a date.
- Add a one-line entry to that folder's README index.
- Plain British English, short prose, no em dashes or arrows. Use X handles, not guessed names.
- Check claims against primary sources and say what was not checked. Mark vendor pitches and
  self-reported numbers as such.
- Keep evidence in the repo (images next to the note, named YYYY-MM-DD-handle-slug-*.jpg).
  Do not cite local paths such as /workspace/.
- Suggested tags: trust-pyramid, guardrails, comments, verification, formal-verification,
  evals, skills-and-instructions, plugins, review-and-merge, ci-speed-and-cost, factory-design,
  always-on-agents, identity-and-permissions, browser-tools, agent-ux, copilot-platform,
  vendor-pitch, self-reported.
- Delete this comment block before committing.
-->

# Short plain title (@handle)

Source: [@handle, D Mon YYYY, HH:MM Europe/London](https://x.com/handle/status/0000000000000000000). One or two lines on what the source is and who is behind it.

## The claim

What the source says, in a few short paragraphs or bullets.

## What checks out

What was verified against primary sources, what is self-reported, and what was not checked. A small table works well: claim, verdict, primary source.

## Related notes

Links to earlier notes in this repo that agree, disagree or cover the same ground.

## Copilot mapping

How this maps onto Sam's GitHub Copilot stack (custom agents, skills, instructions, hooks, coding agent, Agentic Workflows, Copilot Memory, Actions) and pstack. Say what to adopt, what to skip, and what is still open. Keep this heading exactly as written so every note can be found with `grep -rn "## Copilot mapping"`.
