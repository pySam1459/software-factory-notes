# @thisguyknowsai on Google’s Elephant-Goldfish Model (EGM)

- Source: https://x.com/thisguyknowsai/status/2116453452977152209 (@thisguyknowsai / Brady Long on the profile; use the handle). Europe/London: Sat 31 Oct 2026, 08:53 UTC.
- Linked repo: https://github.com/google/elephant-goldfish-model (~6946 stars at fetch; created 2026-09-13; homepage https://egm.dev). Apache-2.0. Plugin author field: Google. README footer: **“This is not an officially supported Google product.”**
- Essay cited in README: Dave Rensin, [Elephants, Goldfish, and the New Golden Age of Software Engineering](https://medium.com/@drensin/elephants-goldfish-and-the-new-golden-age-of-software-engineering-c33641a48874) (not re-read in full this turn).
- Related notes: Ben Holmes factory loops — `2026-10-30-bholmes-factory-two-loops.md`; Ondrej build/review/ship — `2026-10-29-ondrej-build-review-ship.md`; evals skills (separate judge / no self-grade) — `2026-10-30-evals-skills.md`.
- Read this turn: full note_tweet; thread sample; clone of repo `README.md`, `LICENSE`, `plugin.json`, `AGENTS.md` head, `docs/harnesses.md` (install/support matrix), `skills/egm-review/SKILL.md` head (five stages + Goldfish isolation), `agents/` persona list. Attached media is a README screenshot (photo).

## What the post claims
Long-form promo of EGM: Elephant = long-running design session that writes no code; Goldfish = fresh zero-memory reviewers. Pipeline named: brainstorm → draft → comprehension Goldfish → hostile reviewers → go/no-go Goldfish. Says Google open-sourced a plugin “thousands of its engineers use every day,” Apache-2.0, and that it “only runs inside Antigravity for now,” with security not on the default reviewer list.

## What the repo actually says (verified)
- **Idea matches:** Elephant drafts with deep context; Goldfish review the document (and referenced sources) without the prior chat; human owns trade-offs and approval before implementation.
- **Skills (SKILL.md plugins):** `egm-brainstorm`, `egm-draft`, `egm-resolve`, `egm-bootstrap`, `egm-review`, `egm-review-loop`, `egm-drift-report`. Review runs five phases (zoom-out, comprehension, design critique, intermediate zoom-out, implementation readiness) via personas under `agents/` (`zoom_out`, `comprehension`, `design_critic`, `structural`, `style`, `codebase_details`, `implementation_readiness`, plus synthesizer/bootstrap helpers). Fresh subagents required; same-context review is explicitly not a Goldfish review.
- **Install (current README):** Antigravity CLI/App/IDE extension, **Claude Code**, **Codex**, plus Cowork / ChatGPT Work paths. Standalone Antigravity IDE lacks `invoke_subagent` so Goldfish review does not work there.
- **“Thousands of Google engineers”:** repeated in the official README opening line. Treat as Google/EGM’s own claim, not independently audited here.
- **Security Goldfish:** no dedicated `agents/security.md`. `design_critic` mentions security among architectural risks. Post’s “add your own security Goldfish” is fair relative to shipped personas.
- **Licence / support:** Apache-2.0; not an officially supported Google product.

## Engagement / accuracy flags
- Tone is classic AI-Twitter compression (“just open-sourced,” “wildest part,” “kind of brilliant”). Useful idea; treat the tweet as a summary, not a primary source.
- **Stale harness claim in the post:** “only runs inside Antigravity for now” is **wrong against today’s README**, which documents Claude Code and Codex installs. Thread replies (e.g. @kevinb6e, @insanelycat, @Alexcyzhou) already called that out.
- “No AI grading its own homework” is the Goldfish isolation rule; still LLM-on-LLM review, not deterministic checks. Pair with Actions tests for merge gates.
- Internal EGM `AGENTS.md` forbids autonomous PRs without human review; aligns with factory discipline.

## Copilot factory fit (GitHub only; skip ADO)
| Piece | Fit |
|---|---|
| **Skills** | Drop EGM `skills/*/SKILL.md` into the Copilot skills tree (same Agent Skills frontmatter). Prefer installing the whole plugin so reviewers and doc standards load, not skills alone. |
| **Custom agents** | Map `agents/*.md` personas to custom agents / subagents with **isolated** context (Goldfish). Without fresh context, do not call it EGM review. |
| **Instructions / Memory** | Standing rule: no implementation until an approved design doc; Elephant holds architecture memory; coding agents read the approved `docs/designs/…` not the brainstorm chat. |
| **Coding agent** | Implementation only after human go on the draft; use `egm-drift-report` when docs and code diverge. |
| **Agentic Workflows / Automations** | Optional: on design-doc PRs, spawn review-loop jobs; do not auto-merge on Goldfish alone. |
| **Actions** | Keep CI as the hard gate (tests, lint, policy). Goldfish findings are advisory until a human resolves them (`egm-resolve`). |
| **pstack** | Matches the trust curve: design and adversarial review before scale; separate builder from checker; human approval before code. Same spirit as Holmes loops and “agents don’t grade their own work.” |

## Takeaway
EGM is a real Google-org Apache-2.0 skill pack for design-before-code with fresh-context reviewers. Worth trying in the factory as skills + isolated custom agents, with Actions still owning merge. Discount the tweet’s Antigravity-only line; verify install against egm.dev / the README, and add a security persona if you need one.
