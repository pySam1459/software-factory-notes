# Code-driven launch videos (Remotion / HyperFrames)

- Trigger: Sam asked Researcher (27 Oct 2026) how [@Deepusleepy](https://x.com/Deepusleepy/status/2114928745647895003)'s T3 Tots launch video was made ("I'm 99% sure an AI did it so what's the framework/prompt").
- Product: [Deepusleepy/t3-tots](https://github.com/Deepusleepy/t3-tots). Video ~38s, 1920×1080@60fps; kinetic type, 3D UI mockups, status pills, phone mockup. Frames saved under `/workspace/release-video/` on the box.
- **Confirmed:** author never answered how; no video project in the t3-tots repo; no Remotion/HyperFrames hits there. Night-before post said everything was ready except the launch video (~12h window).
- **Inference (Researcher's reply, not author-confirmed):** not generative footage (Veo/Sora/Kling) — pixel-perfect type, no warped UI. Likely an agent wrote **Remotion** (React → video) or **HyperFrames** (HTML/GSAP → MP4).

## Packages named in that reply
- [Remotion](https://www.remotion.dev) — React compositions rendered to video (headless Chrome + FFmpeg). Docs: https://www.remotion.dev/docs
- [remotion-dev/skills](https://github.com/remotion-dev/skills) — official agent skills (`npx skills add remotion-dev/skills`; e.g. `/remotion-create Make a promo video for …`)
- [HyperFrames](https://github.com/heygen-com/hyperframes) — HTML/CSS + seekable animation → deterministic MP4; Apache 2.0; built for agents (`npx hyperframes skills update`)
- Remotion scaffolds/skills for tweet-length launch clips: [EveryInc/product-launch-video](https://github.com/EveryInc/product-launch-video), [memex-lab/product-launch-video-skill](https://github.com/memex-lab/product-launch-video-skill), [chandreshpv/remotion-product-videos-claude-skill](https://github.com/chandreshpv/remotion-product-videos-claude-skill)

## Related (same family; not named in the original reply)
- [Motion Canvas](https://github.com/motion-canvas/motion-canvas) — TypeScript generator animations; MIT. Headless CLI still rough (open issue).
- [Revideo](https://github.com/midrender/revideo) — Motion Canvas fork with headless `renderVideo()`; MIT. Docs: https://midrender.com/revideo/docs

## Why it fits a software factory
- **Code is the source.** Scenes live in git; agents write/edit them; diffs and PR review apply the same as product code (receipts, traits, writer ≠ reviewer).
- **Headless render.** Agent writes the composition, runs the CLI/renderer, inspects frames, iterates — a check that can fail (m4lkxx L3), not a black-box generator.
- **Deterministic.** Same input → same frames; usable in CI regression (golden frames) alongside the evals playbook.

## Licensing caveat (Remotion)
- Free for individuals / companies with ≤3 people (incl. commercial and automation): https://www.remotion.dev/docs/license
- Companies with 4+ people need a **Company License** (remotion.pro): Creators seats (~$25/seat/month) and/or Automators (~$0.01/render, $100/month minimum). From Remotion 5.0, Automators telemetry via `licenseKey` is mandatory.
- HyperFrames is Apache 2.0 with no per-render fees (per its README). Prefer it if Remotion's company licence is a blocker at Microsoft scale; re-check both before shipping an internal tool.

## Takeaway
For agent-made promo/launch videos, prefer code→render (Remotion or HyperFrames) over generative video models when text and UI must stay sharp. Author of the T3 Tots clip still hasn't confirmed which stack; treat Remotion/HyperFrames as the best-fit category, not a citation.
