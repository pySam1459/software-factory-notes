# Maze: codebase slop indicators

- Source: https://x.com/mazeincoding/status/2115575731585507796 (28 Oct 2026, @mazeincoding / Maze). Quote-tweet of Ayush Soni's design-slop list: https://x.com/ayushsoni_io/status/2115322579187867898. No images, video, or linked article on either post.
- Author replies in-thread: (1) on layer-first folders — "to make one logical change, you need to touch files in different folders a lot (they call it colocation)"; (2) agrees "lots of low value comments" also count; (3) to a joke "@claude find these & fix them": "unironically this would probably work / we've gotten very far."

## The list (verbatim shape)
codebase slop indicators:
- implicit coupling
- layer-first folders
- duplication
- representable illegal states
- god files
- shotgun surgery
- layering violations
- pass-through wrappers
- errors / validation not at the boundary

Plus from replies: low-value comments.

Quoted design list (context only, not the ask): tags, italicized words, Instrument Serif / negative kerning, over-detailed UI, dividers, many colour shades/opacities, bordered containers, detailed diagrams, code breadcrumbs, section numbering.

## Worth keeping (pstack + GHCP factory)
Checklist of smells agents (and humans) leave when soft style wins over structure. Maps cleanly onto poteto/pstack hard-constraints and Sam's Copilot-only MSFT factory:

| Indicator | Factory move |
|---|---|
| Layer-first folders / shotgun surgery | Prefer feature co-location (same as poteto workshop). Encode as a **custom instruction / skill** and, where possible, a dependency-graph **CI** check so the coding agent can't import across banned edges. |
| Implicit coupling / layering violations / pass-through wrappers | Reviewer **custom agent** (read-only) flags them; graduate repeats into lint or an **Agentic Workflow** PR check via safe outputs. |
| Representable illegal states | TypeScript (and Python typing) as the hard gate: make illegal states unrepresentable; builder agent must satisfy typecheck before "done". |
| God files / duplication | Size/complexity lint or skill rubrics; `/poteto-mode`-style playbooks that refuse mega-files without a split plan. |
| Errors / validation not at the boundary | Standing **skill** + **Copilot Memory** trait: validate at API/UI edges, not deep in domain paths; CI or Agentic Workflow greps for scattered validation as a soft start. |
| Low-value comments | Matches poteto's CI ban on code comments. **Instruction** + lint/CI; reviewer agent declines descriptive noise. |

Practical: put this checklist in a reviewer skill the GHCP cloud/coding agent runs on every PR; anything that keeps failing becomes a hard CI rule (soft → hard, same as the traits playbook). Don't ask the builder to grade its own slop.

## Caveats
- Bullet list, not a measured study. No definitions, examples, or fix recipes in the post.
- "They call it colocation" in the layer-first reply is terse; reading it with poteto/common practice: layer-first causes cross-folder edits; feature colocation is the usual remedy. Don't over-read the parenthetical.
- "Claude can just fix them" is optimism, not evidence; without verification gates the agent will rearrange smells.
- Design-slop quote is UI taste, not software-factory policy — ignore for the MSFT backend/frontend work unless doing marketing UI.

## Takeaway
A short anti-slop checklist for agent-written codebases. Steal it as a GHCP reviewer skill + CI graduation list next to pstack: co-locate features, ban illegal states in types, validate at boundaries, kill god files and empty comments — and don't let the builder mark those fixed without a check that can fail.
