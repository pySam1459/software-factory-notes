# @thenowhereway five (plus one) UI sites for “unslopping” vibe-coded apps

- Source: https://x.com/thenowhereway/status/2116406644636864577 (@thenowhereway / Devansh). Europe/London: Sat 31 Oct 2026, 05:47 UTC.
- Pitch: “Vibe coders, thank me later” + five links + “Your app stops looking AI-generated!”
- Author add in thread: special mention https://avaraui.com/ (https://x.com/thenowhereway/status/2116438499801120902).
- Author caveat (reply): without a baseline style, Magic UI / Mobbin can still look patchwork.
- Classification: **UX resource list** (React/shadcn component catalogs + screen inspiration). Candidate OG stills in `/workspace/notes-out/ux-add2/`. Also a reading note so the relevance verdicts live with factory mapping.
- Related: ux agent-components folder; AffectUI notes; this note’s sibling on AI-slop rules.

## Sites (verified)

| Site | URL | What it is | Relevance |
|---|---|---|---|
| **21st** | https://21st.dev/ | Community registry of 12k+ React/Tailwind/shadcn components & templates; copy prompt or CLI; MCP/agent install (`npx @21st-dev/cli`). Free browse, copy limits; paid membership. | **High** for TS frontend: agent-installable components, AI-ready `.md` twins. Not agent-ops chrome (AffectUI); marketing/app UI. |
| **React Bits** | https://reactbits.dev/ | Free animated React components/backgrounds/micro-interactions; copy source or CLI; JS/TS + CSS/Tailwind. | **Medium–high** for polish/motion on the TS app; watch for decorative motion over product clarity. |
| **Magic UI** | https://magicui.design/ | 150+ free/open animated React + Tailwind + Motion components; positioned as shadcn companion. | **Medium–high** same niche as React Bits; good for landing/marketing, easy to over-animate agent dashboards. |
| **Uiverse** | https://uiverse.io/ | Large community library of open UI elements; copy as HTML/CSS, Tailwind, React, Figma. | **Medium**: quick elements (buttons, loaders); weaker as a coherent system; mix-and-match risk. |
| **Mobbin** | https://mobbin.com/ | Searchable library of real mobile/web screens and flows; free limited; Pro/Team for full + **MCP for agents**. | **High** for design research and agent UX references (real products, not vibes). Paid for serious use. |
| **Avara UI** (thread) | https://avaraui.com/ | ~190 free MIT shadcn/Tailwind/Motion/GSAP components + MCP; CLI into your repo. | **Medium–high**: same stack as factory frontend; MCP + CLI fit Copilot/coding agents. |

No evals, formal verification, or AI-friendly codebase tooling in this list. Overlap with existing AffectUI work is low (AffectUI = agent runtime chrome; these = general product UI / animation / inspiration).

## Worth Sam’s time (top 3)
1. **Mobbin** (research real agent/product screens; MCP if budget allows).
2. **21st** (agent-installable registry + MCP when generating TS UI).
3. **Avara UI or Magic UI** (pick one system, not both, to avoid patchwork; Avara if you want MIT + shadcn CLI + MCP).

## Copilot / pstack angle
- **Skills / instructions:** “Prefer components from our chosen registry; never mix five libraries on one screen.”
- **Coding agent:** install via shadcn/21st/Avara CLI into the TS app; keep design tokens owned by the repo.
- **Evals / Actions:** visual regression on key screens; optional design-review skill against the AI-slop rules note.
- **pstack:** these raise the floor of generated UI; they do not replace trust gates.

## Takeaway
Useful for the TypeScript frontend and `ux/` moodboard; ignore as a substitute for agent-ops components. Start with Mobbin + one registry (21st or Avara), and enforce a single baseline style so “unslopping” does not become collage.
