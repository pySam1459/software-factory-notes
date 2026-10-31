# Good design vs AI-slop design (rules for agent-generated UI)

- Prompt: Sam on https://x.com/uiwithjay/status/2116203419019174128 (@uiwithjay): “Unslopping vibecoded mobile app” (10s video). Europe/London: Fri 30 Oct 2026, 16:19 UTC.
- What the video shows (frames read): a glucose-monitoring mobile UI. Early/annotated frames use dense white cards, one orange accent, a huge primary metric (112 mg/dL), real chart events, and marked spacing (12/18/20px). Later frames of related screens use warmer orange gradients, frosted glass cards, and a floating pill dock. Thread is mostly praise; one reply notes the trend is step-by-step iteration, not a single-frame overhaul. Preview/before-ish stills: `uiwithjay-unslop-preview.jpg`, `uiwithjay-unslop-before.jpg`, `uiwithjay-unslop-after.jpg`. Video: https://video.twimg.com/amplify_video/2116203279202107392/vid/avc1/1440x1080/zqFrWMrvBjbj3ZZv.mp4
- Verified sources (not invented quotes):
  - [AI Design Tells harness](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md) (open taxonomy of machine-default tells; drop-in agent instructions).
  - AI Design Tells paper (labs.iovstudio.jp/papers/ai-design-tells.pdf): listed in search results as a 27-tell taxonomy; **TLS fetch from this box failed** (unexpected EOF), so treat the PDF itself as unverified here. Category structure below is taken from the open GitHub harness, which we did read.
  - [Sailop AI Slop Encyclopedia](https://sailop.com/blog/ai-slop-encyclopedia) and [typography tells](https://sailop.com/blog/ai-typography-tells-fonts-and-type-mistakes-to-avoid-2026) (pattern catalog with fixes).
  - Spacing/whitespace craft is also the refrain of [Refactoring UI](https://refactoringui.com/) (cited by the tells harness as the cheapest “looks designed” lever).
- Related: `reading-notes/2026-10-31-thenowhereway-ui-sites.md` (component catalogs); AffectUI / ux agent-components; evals-skills (validate judges).

## Inference from the video + sources

Jay’s “unslopped” glucose app wins on **hierarchy** (one number dominates), **real content** (carb counts, time-in-range zones, meal markers), **one accent hue** used for action/status, and **spacing that groups** (annotated gutters). Where later frames lean on orange gradients and heavy glass, that trades toward trends the tells list warns about. Rules below keep the video’s strengths and the published tell taxonomies, framed so each can become a Copilot instruction, a design-review skill rubric, or (where mechanical) an Actions lint.

## Rules (opinionated)

1. **One brand hue, semantic tokens, no house indigo.** Slop: indigo/violet defaults and blue to purple hero gradients ([AI Design Tells A1/A2](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: pick the product hue (Jay’s orange for glucose action/status), expose `--color-action` / `--color-danger`, reserve gradients for meaning. *Lint:* ban raw `indigo-*` / `violet-*` utilities outside brand tokens; flag blue-to-purple linear gradients on heroes.

2. **Typography is a system, not Inter-by-default.** Slop: Inter/Roboto/system only, two weights, no tracking ([Sailop typography](https://sailop.com/blog/ai-typography-tells-fonts-and-type-mistakes-to-avoid-2026); tells B1–B3). Good: display+body pairing, 4–6 step scale, negative tracking on large headings, ≥12px labels. *Instruction:* “Use the repo font tokens; never introduce Inter as a new face.” *Judge:* score hierarchy (size×weight×color) on screenshots.

3. **Content dictates layout; kill the three-card template.** Slop: hero + three identical emoji/feature cards, everything centered ([tells C1/C2/C4](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: asymmetry when content needs it; icons from one set. Jay’s Today screen is two dense cards with a chart, not a marketing trio. *Skill:* reject PR screenshots that match hero+3-up marketing unless the product is literally that landing page.

4. **Vary spacing to show grouping; never one padding everywhere.** Slop: same `p-6` / 24px on every card; metronome section `py-20` ([tells D1/D2](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md); [Refactoring UI](https://refactoringui.com/)). Good: tighter gaps for related items, more air for the hero metric (video’s 12/18/20 annotations). *Lint:* fail if >80% of cards share one padding token; require spacing scale in theme.

5. **Real copy and real (or realistic) data only.** Slop: “Build the future of…”, Get Started/Learn More only, lorem, fake smooth charts ([tells G](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: specific claims and domain numbers (112 mg/dL, 54 g carbs, 78% in range). *Actions:* grep for `lorem`, `Get Started` as sole CTA, `Build the future`; design-review skill flags generic headlines.

6. **Radius and elevation scale with nesting.** Slop: one radius everywhere; `shadow-lg` on every card; card-in-card chrome ([tells C3/E1/E4](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: outer radius > inner; hairlines and tight shadows or flat divides. *Lint:* detect nested bordered+rounded wrappers; cap default shadow utilities.

7. **Glass and blur are accents, not the theme.** Slop: frosted everything ([tells E2](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). The video’s later glass screens look fashionable but are closer to the tell; prefer the denser opaque cards when information density matters (agent dashboards, clinical UIs). *Instruction:* “Default to solid surfaces; backdrop-blur only for one overlay layer.”

8. **Motion and microstates with intent.** Slop: the same fade-in on every block; missing hover/focus/active/disabled ([tells F](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: short curated motion; all six interactive states. *Eval:* checklist judge on interactive components; optional reanimate-style compare for motion clones.

9. **No AI self-reference chrome.** Slop: sparkles/wand/brain icons, “AI-powered” labels, generate, then preview, then insert theatre ([tells H](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). Good: name the function (draft, auto-sort); apply then undo. *Critical for Sam’s agent product UI.*

10. **One baseline system before catalogs.** Slop: Mobbin + Magic UI + Uiverse collage (author’s own caveat on the vibe-coder list). Good: tokens + one component lineage (shadcn/Avara/21st), then references. *Instruction:* “Do not add a second UI kit without removing the first.”

## How to wire into the factory

| Mechanism | Use |
|---|---|
| **Custom instructions / Memory** | Paste a shortened “Design like a person” block (or link this note + the [tells harness](https://github.com/hankimis/ai-design-tells/blob/main/harness/AI-DESIGN-TELLS.md)). |
| **Skill `design-review`** | Binary Pass/Fail per rule above on a screenshot + DOM summary; few-shots from Jay before/after and known slop. Validate with human labels (evals-skills `validate-evaluator`). |
| **Actions** | Token/spacing/font grep lints; optional Playwright screenshot diffs on golden routes. |
| **Agentic Workflows** | On UI PRs, run design-review skill; human still owns taste. |

## Takeaway
AI slop is the **median of training defaults**. Good design is **stated intent** on colour, type, layout, spacing, surface, motion, and copy, plus real content. Use Jay’s density and hierarchy as the north star for product/agent screens; use the open tell taxonomies as the checklist; keep catalogs subordinate to one token system.
