# @KacperRutk: Dr Eggbot + Matt Pocock /grill-me for high-quality Grok Bots

- Source: https://x.com/KacperRutk/status/2116581817570509255 (@KacperRutk / Kacper Rutkiewicz, DeepRooted AI). Europe/London: Sat 31 Oct 2026, 17:23 UTC. Text: “Dr eggbot + @mattpocockuk ‘s grill me skill is the easiest way to create high quality bots. Give it a try. Seriously.” Quotes poteto’s team guide.
- Quoted: https://x.com/poteto/status/2116576229319233596: already captured in `poteto-advice/2026-10-31-grok-bot-team-guide.md` (Dr Eggbot, few bots, skills in private GH, vault/connectors, voice + restate).
- Dr Eggbot: https://x.ai/bot/_jOdbfkB16zxu7MRcmReE (poteto’s bot designer; coding bots get poteto-mode bar).
- /grill-me primary: [mattpocock/skills](https://github.com/mattpocock/skills) (~308k★, MIT) · docs https://www.aihero.dev/skills-grill-me · path `skills/productivity/grill-me/SKILL.md` · skills.sh listing ~1.5M installs for grill-me alone. Install: `npx skills@latest add mattpocock/skills` (or Claude plugin `mattpocock-skills`).
- Folder: **reading-notes/** (third-party tip combining two known tools; poteto’s guide itself stays in poteto-advice/).
- Thread: one reply pointing at a public Grok Bot directory; no author elaboration.

## Verdict (lead)

**Narrow but actionable.** The post is short endorsement, not a tutorial. Both halves check out: Dr Eggbot is poteto’s published bot designer; `/grill-me` is Matt Pocock’s widely installed, user-invoked interview skill (stateless; `disable-model-invocation: true` so the agent will not auto-fire it). “Easiest way” is opinion. Useful for Sam as a **bot-design workflow**: grill the bot’s job/scope first, then hand the sharpened brief to Dr Eggbot (or a GHCP custom-agent scaffolder), instead of vibe-prompting a new bot.

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| Dr Eggbot creates high-quality Grok Bots | **Author/ecosystem claim, tool is real.** poteto’s guide and bot page describe it as her designer; coding bots include poteto-mode expectations. Quality still depends on the brief you give it. | poteto post · https://x.ai/bot/_jOdbfkB16zxu7MRcmReE · poteto-advice note |
| @mattpocockuk’s “grill me” skill exists and is for sharpening plans | **True.** `/grill-me` interviews until the frontier of undecided questions is empty; no files written; invoke in a fresh conversation. Related: `/grill-with-docs`, `/wayfinder`. | https://github.com/mattpocock/skills · https://www.aihero.dev/skills-grill-me |
| Combo is “the easiest way” to create high-quality bots | **Opinion / unmeasured.** Plausible workflow (grill then designer bot); not a controlled comparison. | Framing only |
| Quotes poteto’s guide | **True.** Same URL as the poteto-advice note from today. | Entities on the post |

## What to steal vs skip

**Steal**
- Workflow order: `/grill-me` (or grill-with-docs in a repo) on “what should this bot own?” then Dr Eggbot / custom-agent scaffold then skills + evals as poteto already advises.
- Keep `/grill-me` user-invoked; Matt warns against passivity (nodding through dozens of questions).

**Skip / caveats**
- Do not treat Kacper’s one-liner as new poteto doctrine; the substance is already in the team-guide note.
- `/grill-me` is harness-agnostic (Claude Code, Cursor, Codex, etc.); wiring it into Grok Bot may mean pasting the skill text or reimplementing the grilling loop as a Grok skill, not a one-click install inside xAI.
- skills.sh install counts are popularity signals, not quality proofs.

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills** | Add `mattpocock/skills` (at least grill-me / grilling) to the factory skills repo; invoke before scaffolding a new custom agent. |
| **Custom agents** | Dr Eggbot analogue: a “bot/agent designer” custom agent that only emits agent definitions meeting poteto-mode (one job, verified). Feed it the grilled brief. |
| **Instructions / Memory** | Grilled decisions to standing instructions for that agent; restatement step after the grill (aligns with poteto “restate in your own words”). |
| **Coding agent** | Use grill-with-docs when the new agent must respect an existing codebase/GLOSSARY. |
| **Agentic Workflows / Actions** | Unchanged by this post; still the place for deterministic checks once the agent’s job is defined. |
| **pstack** | Grilling before build matches verify-the-plan-before-tokens; poteto-mode stays the quality bar for coding bots. |

## Takeaway

A two-tool recipe on top of today’s poteto guide: **grill the job, then ask Dr Eggbot (or your GHCP designer agent) to build the bot.** Worth a try when spinning a new factory bot; not a substitute for skills, evals, vault/connectors, or a small roster.
