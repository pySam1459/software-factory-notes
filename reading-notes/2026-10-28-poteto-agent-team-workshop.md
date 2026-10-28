# poteto (Lauren Tan) workshop: trust, verification and hard constraints

- **Source:** [X post by @akarixbt](https://x.com/akarixbt/status/2114389035388989873), which attaches a ~57 min workshop video. Lauren Tan (poteto), software engineer at SpaceXAI and ex-Cursor, talking with a host (Colin).
- **Read:** 2026-10-28
- **Caveat:** the post's hype ("50+ agents", "job of 20 engineers", "97% of engineers", "$750K offers") is not said anywhere in the video. Her real numbers are 3000+ PRs in 5 months, ~1,000 last month, and waking up to ~20 PRs merged by agents.

## Core idea: the trust curve
Trust vs number of agents. If you don't trust an agent's output you have to micromanage it and you can't parallelise. Build trust locally first and scale to cloud agents only afterwards. Spawning hundreds of agents early just burns tokens.

## Verification is the most important skill
- "When you don't have a verification skill, you are the verifier. You're the bottleneck."
- Agents should run the app, take CPU/heap traces and drive the UI themselves (e.g. her `control-glass` skill drives Cursor's agent window over the Chrome DevTools Protocol, and Apple tooling covers iOS).
- **Feature map:** an agent-facing markdown doc that maps the UI to navigation paths, shortcuts, aria-labels and DOM selectors, so vague reports like "the sidebar is laggy" become actionable.
- **pstack** ("potato stack", a nod to Garry Tan's gstack): her Cursor plugin, with commands to create and maintain verification skills and feature maps.
- Cloud agent "Benny" takes bug reports, spins up a cloud desktop, reproduces the bug (or confirms it's already fixed on main) and attaches a screen recording.

## Building and evaluating skills
- Agents confidently claim to work on a bug without reading the relevant code. Check their tool calls.
- Evals are unit tests for skills: a coordinator agent writes a rubric and a judge from a *different model* cross-checks it. Give sub-agent dirs innocuous names, because "agents can actually tell [they're being evaluated] and when they do they change their behavior."
- Be a backseat driver: read the thinking blocks and tool calls to find where they fail. Loop (`/loop`) until the rubric scores 10/10.
- Michelin kitchen / software factory: the engineer is the head chef whose job is to design the environment.

## Hard constraints beat soft ones ("Dune")
- Agents take the shortest path. Five enforcement layers: (1) the codebase, (2) static analysis (lint, compiler, CI), (3) rules/Bugbot, (4) skills, (5) style guide. Layers 3-5 are soft and get forgotten: "only a matter of time before your codebase looks like complete trash."
- A human enforcing constraints in code review is an anti-pattern. Turn a review comment into a lint rule or a CI failure.
- Dune is their in-house "Next.js for Electron apps" built for agents. She spent 600+ PRs refactoring GrokBot onto it, and now she "really doesn't look at the code anymore."
- CI bans `useEffect` and **bans code comments** ("99% of the time, agents just write code comments that describe some historical thing that is actually totally irrelevant").
- CI enforces the directory dependency graph (e.g. `electron-main` must never be imported into the renderer).
- Feature co-location: everything for one feature lives in one directory, which covers ~80% of an agent's work.
- Small atomic PRs (50-1,000 lines): a clean git history is context for agents and makes reverts trivial.
- Rust is good for agents: if it compiles without `unsafe`, you can trust it more.
- "It's actually very annoying to write code in GrokBot, but agents absorb all of that annoyance." Design for "the dumbest agent".
- Greenfield vibe-coded apps are the biggest risk, because sprawling "organic architecture" grows without guardrails. Brownfield big-tech monorepos already have guardrails for the least capable engineer, and those work for agents too.

## Cost and non-engineers
- The token cost is framed as ROI: refactoring towards hard constraints upfront is cheaper than a huge engineering org.
- With strict constraints, PMs and designers ship bug-fix PRs through GrokBot and she just stamps them.

## Takeaways for me
- This matches my no-comments, no-`useEffect`, strict-lint list almost exactly, and she enforces all of it in CI rather than in instructions.
- For the new Python/TS project: write a dependency-graph check, co-locate features, and make every repeated review comment a lint rule.
- Build verification skills and a feature map before scaling to more agents.
