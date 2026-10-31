# @niazmorshed_ /reanimate: frame-verified animation cloning skill

- Source: https://x.com/niazmorshed_/status/2116006291852423247 (@niazmorshed_ / Niaz Morshed). Europe/London: Fri 30 Oct 2026, 03:16 UTC (~3760 bookmarks / ~2910 likes at fetch; engagement bait risk on the numbers, not on the artefact).
- Site: https://reanimate.niazmorshed.dev/
- Repo: https://github.com/NiazMorshed2007/reanimate (~307 stars at fetch; created 2026-10-29). **MIT** (Copyright 2026 Niaz Morshed).
- Install: `npx skills add NiazMorshed2007/reanimate -g` ([skills.sh](https://skills.sh)); needs **Bun** 1.1+, macOS/Linux; first run ~250 MB Chromium + ffmpeg. **Tested with Claude Code**; Agent Skills–compatible for others but unverified by the author.
- Thread: GitHub link reply; author notes a single `/reanimate` command wraps the full loop.
- Related: ux component catalogs note; Holmes loops (verify not vibes); evals skills (evidence over self-grade).

## What it is
A Claude Code **skill** that reverse-engineers motion from a live URL, screen recording, mp4/gif, or Lottie: record reference → write motion spec → rebuild in the project’s stack (CSS / Framer Motion / GSAP / three.js) → record the clone the same way → pixel/timing compare → iterate (usually 2–5 rounds). Deliverable is code **plus** evidence sheets, not “looks about right.”

Fidelity levels (from SKILL.md / README):
- **motion-faithful** (default): timing ±80 ms, easing family, sequence; brand/copy may differ.
- **pixel-faithful**: plus fonts/colours/spacing; mean frame mismatch ≤ 2 %.
- **mixed**: clone X and add Y.

Site demos claim clones of vercel.com, nextjs.org, stripe.com, clerk.com, etc., with quantitative match scores. Treat demo numbers as author-reported; the method (deterministic capture + compare scripts) is what matters for the factory.

## Caveats / unverified
- “Any animation from any website” marketing; README limits: login walls, YouTube/Loom need a screen recording; physics springs are fitted; copyright still belongs to owners.
- Clone times of 28–90 minutes per example are author claims.
- Windows untested; only Claude Code tested end-to-end.
- Pixel cloning can raise IP risk; skill itself warns fonts/images/code still belong to owners.

## Copilot factory fit (GitHub only; skip ADO)
| Piece | Fit |
|---|---|
| **Skills** | Drop-in Agent Skills shape (`skills/reanimate/SKILL.md`). On Copilot, install if the harness reads skills + can run Bun/Playwright locally (coding agent / cloud with browser). |
| **Custom agents** | Optional dedicated “motion clone” agent that only runs `/reanimate` workflows. |
| **Instructions** | Prefer motion-faithful for product UI; reserve pixel-faithful for internal experiments; never ship cloned brand assets. |
| **Coding agent** | Primary home: local Bun + Chromium. |
| **Actions** | Hard to put full loop in CI (browser + long runtime). Possible: store `.reanimate/*/compare` artefacts as PR attachments; fail if compare scripts missing after a claimed clone. |
| **Evals** | Same spirit as evals-skills: measure, don’t self-grade. Diff sheets ≈ visual eval evidence. |
| **pstack** | Trust via verification loops (record → compare → fix), not vibe. Useful for TS frontend polish after picking reference motion from Mobbin/21st. |

## Takeaway
High-signal skill if Sam wants agent-driven motion that is **proven** against a reference. Worth a trial on one internal widget under Claude Code or a Bun-capable Copilot coding agent; keep IP hygiene and default to motion-faithful.
