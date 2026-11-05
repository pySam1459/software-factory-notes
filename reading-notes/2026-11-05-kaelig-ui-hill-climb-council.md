# UI hill climb with a model council (@kaelig, after @theo)

Source: [@kaelig on X, 5 Nov 2026 07:00 UTC](https://x.com/kaelig/status/2118237118996849054) (design systems / eng tooling; prototyping at @mercury). Full text via `note_tweet`. About 21 likes, 5 replies, 41 bookmarks at fetch. Links Theo's YouTube: [Agents Sucked At UI (Until Today)](https://www.youtube.com/watch?v=xq0eB8vxeqk) (uploaded 3 Nov 2026, ~31.7 min). Reply image (Sol vs Opus agreement table): [2026-11-05-kaelig-sol-vs-opus-agreement.png](2026-11-05-kaelig-sol-vs-opus-agreement.png).

Related notes: [@theo tstack skills (incl. council)](2026-10-26-theo-tstack-skills.md); [Warp / Zach factory evals and A/B](2026-11-04-zachlloydtweets-dont-vibe-code-your-factory.md); [Ben Holmes two factory loops](2026-10-30-bholmes-factory-two-loops.md); [luhsnaa agent evals](2026-11-01-luhsnaa-agent-evals.md); [/retro skill paper](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md); [good design vs AI slop](../ux/2026-10-31-good-design-vs-ai-slop.md); [UI catalogs for vibe coders](2026-10-31-thenowhereway-ui-sites.md).

## What Kaelig reports

Full post:

> omg @theo got it right: turn UI work into a hill climb and let a council of models grade it
>
> i'm running it on an internal prototyping tool at @mercury, with Claude and Codex grading >800 screenshots and iterating along
>
> token hungry (!!!), but the UI is genuinely getting much better… 37 merged PRs in a day and it's still going

Self-reported and unverified here: **>800 screenshots**, **37 merged PRs in a day**, and (in a reply) Opus filing **4x** more defects than Sol. Treat as anecdote from one internal run, not a benchmark.

## Thread replies worth keeping

- **@tarxemn** asks whether Claude and Codex disagree. **@kaelig**: disagreement is enough to keep the loop going. "Sol files way fewer defects but goes super deep into them, whereas Opus is very thorough (4x more filed defects)." The attached table (checked by eye) shows first-pass agreement within 1 point at roughly 75% to 82% across rounds 0 to 4, then after each side defends its scores agreement rises to about 95% to 100%. Caption above the table: "On first pass, yes, regularly. After each side defends its scores, they almost always agree." Useful pattern: force a defence round, do not stop at the first pairwise score.
- **@tombohdalek** asks whether a UX person would be faster and cheaper. **@kaelig** (full `note_tweet`): he has dev and design tooling experience so he can steer where it matters, but models still produced work he would not have thought of; "models solved dozens of edge cases i would have never thought of, and it would likely take a designer weeks to go through all of these." He then quotes [@clairevo's clip of @ezramechaber](https://x.com/clairevo/status/2117754272054141007) on Codex browser use ("Astra") relentlessly testing release edge cases. Adjacent technique, not the same as screenshot grading.
- **@benkingfm** (pushback): "Then why does T3 Code still look so bad? It would be a lot faster just to learn a sense of taste." Fair taste critique; mirrors replies on Theo's original hill-climb post.
- **@frankstallone** asks which models sit on the council. Unanswered in the sampled thread (Kaelig's own run names Claude and Codex; Theo's video names a three-provider council).
- **@quatermain32**: plug for a PR dashboard app. Vendor plug; ignore for the technique.

No further replies on the next search page.

## What @theo actually said

Primary sources checked:

1. Tweet (25 Oct 2026): [Think I can turn T3 Code's UI into a hill climb for Opus?](https://x.com/theo/status/2114280056784921048), quoting @robinebers on fonts, radius, icons and hierarchy.
2. YouTube (3 Nov 2026): [Agents Sucked At UI (Until Today)](https://www.youtube.com/watch?v=xq0eB8vxeqk). Local copy under `/workspace/videos/theo-ui-hill-climb.mp4` (and a downscaled `theo-ui-hill-climb-small.mp4`). Analysis from auto-captions: `/workspace/videos/theo-ui-hill-climb-analysis.md`.
3. [t3dotgg/tstack](https://github.com/t3dotgg/tstack) `skills/council/SKILL.md` (MIT): three delegates, one strong model per provider; score out of 10; loop until satisfied; write a rounds table into the PR description. Defaults in the public skill are Claude Opus, GPT Sol, Gemini Pro (overridable in user instructions). The video walkthrough names Opus 5.5, Muse Wonderful and Codex GPT 6.1 Sol for his personal council.
4. Follow-on (27 Oct): Theo's [tool-schema hill climb](https://x.com/theo/status/2114955695434993702) uses the same *shape* on MCP tool descriptions (eval of ~80 cases, bench Sonnet then Sol then Opus, then trim context). He says that shape was "not far from the UI overhaul hill climb."

### Method (from the video + council skill)

1. Seed the goal from a real taste complaint (Robin: fonts, radius, icons, hierarchy).
2. Prompt the agent to open a UI polish PR and **iterate until the council scores a fixed set of app screenshots at least 9/10**.
3. Council = multi-provider reviewers (vision on screenshots for UI; read-only for review). Each round: score, fix, re-score.
4. Ship when the council is happy (T3 Code got a beta toggle for old vs new design).
5. Theo's self-report for the UI run: about **18 hours**, **five models**, **30-plus** review rounds. Token-heavy by design ("I spent the tokens so you don't have to").
6. Explicit caveat in the same video: having other models look at the thing is "silly but working"; **programmatic scores are better** when you can write a scorer. Same lesson as the Warp factory-engineering loop and the Ben Holmes benchmarking loop.

Useful pushback on Theo's original tweet (same themes Kaelig will hit): taste has no ground truth (@iA3Hi, @Bonigala); if Opus grades its own screenshots you climb toward AI-default UI (@0xVK__, @jj_kovacs, @vayungodara); pin judge model + written rubric + fixed screens (@CityzenHyd); add layout/a11y/token lints and multi-viewport shots so the objective cannot collapse to border-radius polishing (@Kizuno18, @Alex_Vainshtein, @tuffbrownboy).

## What checks out

| Claim | Verdict | Source |
|---|---|---|
| Theo framed T3 Code UI as a hill climb for Opus | **Checks out** | Tweet 25 Oct + YouTube 3 Nov |
| Council skill exists in tstack | **Checks out** | [github.com/t3dotgg/tstack](https://github.com/t3dotgg/tstack) `skills/council` |
| Prompt target was council ≥9/10 on screenshots | **Checks out** (from auto-captions) | YouTube transcript pass |
| Kaelig >800 screenshots / 37 PRs / Opus 4x defects | **Self-reported** | His post and reply only |
| Theo ~18h / 5 models / 30+ rounds | **Self-reported** | YouTube |
| Defence rounds drive Sol/Opus agreement near 100% | **Self-reported table** | Reply image; numbers not independently reproduced |
| Magic Patterns segment | **Sponsor** | Mid-video ad |

## Factory technique (portable bit)

Turn UI quality into a scored loop:

1. Fix a **viewport pack** (screenshots or Playwright traces) and a **written rubric** (hierarchy, type scale, radius/token compliance, contrast, density). Prefer rules from [good design vs AI slop](../ux/2026-10-31-good-design-vs-ai-slop.md) over "looks nice".
2. Run a **multi-model council** as grader (builder ≠ judge). Keep a defence/debate pass when scores disagree, as in Kaelig's table.
3. Let the coding agent iterate on a branch until the score plateaus or hits a threshold.
4. Cap tokens and rounds. Stop for a **human taste check** before merge.
5. Prefer adding deterministic gates (token lint, contrast, layout-shift, multi-width screenshots) so the hill has countable footholds, matching Theo's own "programmatic scores are better" line and the Warp hermetic-eval advice in the [Zach factory note](2026-11-04-zachlloydtweets-dont-vibe-code-your-factory.md).

Pair with [/retro](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md): after a climb, prune rubric items that only pleased the judge.

## GHCP mapping for Sam's factory

| Piece | GHCP home |
|---|---|
| Screenshot pack | Playwright (or similar) in Actions; store PNGs as workflow artifacts. See also [dave_deguzza Playwright Chromium cleanup](2026-11-03-dave_deguzza-playwright-chromium-cleanup.md) for runner hygiene. |
| Rubric | Repo skill or instructions file (e.g. `.github/skills/ui-rubric/SKILL.md`) with countable checks plus taste criteria. Seed from the UX slop rules note. |
| Council grader | Agentic Workflow or custom agent that calls **more than one** Copilot/available model (or an external second provider if the harness allows). Require a defence round when scores differ by ≥2. Builder agent must not be the only judge. |
| Iterate until plateau | Copilot coding agent on a branch; loop "fix, re-screenshot, re-grade" with a hard round/token budget in the workflow. |
| Token hunger | Budget caps in the workflow; sample screenshots rather than grading every frame every round; cheaper model for first pass, frontier only on disputes. |
| Human taste gate | Required reviewer / CODEOWNERS on UI paths; do not auto-merge on council 9/10 alone (@benkingfm's point). |
| Eval hygiene | Persist screenshots + scores + config version as artifacts (Warp-style). Hold out a few screens from the optimisation set (@foundrcode on Theo's thread). Tie rubric edits to /retro. |

**Native today:** Playwright in Actions, coding agent iteration, skills/instructions as rubric, Agentic Workflows for scheduled or PR-triggered grading, human review gates.  
**Build:** true multi-provider council if Copilot alone is not enough diversity; defence-round protocol; hold-out screen set; token budgets; combining vision grades with deterministic a11y/token lints so taste cannot be the only reward.

## Takeaway

Kaelig is applying Theo's published pattern: make UI a hill with a multi-model council scoring screenshots, then iterate. Theo's video and tstack `council` skill make the method concrete (9/10 threshold, three-provider reviewers, rounds table). Kaelig's Mercury numbers and the Sol-vs-Opus table are useful but self-reported; the durable factory lesson is rubric + multi-judge + defence pass + human taste gate + token caps, with deterministic lints underneath so you are not only climbing toward whichever model likes rounded cards.
