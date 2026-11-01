# Ray Amjad: Claude Code verifiers and Prove It skills (1 Nov 2026)

- Source: https://youtu.be/JETl3kG_Ur0 (also https://www.youtube.com/watch?v=JETl3kG_Ur0). Channel: **Ray Amjad** (`@RAmjad`). Title: **TOP 1% Agentic Engineering: Claude Code Verifiers**. Uploaded **1 Nov 2026**. Duration about **19 min 15 s**. Views/likes at fetch were low (fresh upload).
- **Not watched.** Summary is from yt-dlp metadata plus **auto-generated English captions** downloaded with the Android player client (`sub-JETl3kG_Ur0-android.en.vtt`). `youtube-transcript-api` was IP-blocked from this box. Raw caption text is not stored in this repo. Captions are imperfect (e.g. "Enthropic", "pro it", "cloud" for Claude).
- Description plugs: cohort (agenticcoding.school), Impello sandboxes, AgentStack, HyperWhisper; skills at https://github.com/ray-amjad/skills (MIT, ~35★ at fetch, labelled **beta**).
- Primary links from the description (checked): Anthropic Scion merge-rate post https://www.anthropic.com/research/redesigning-source-control ; Latent Space "How Anthropic ships" https://www.youtube.com/watch?v=MRQTlwcW-aQ ; e2e framework https://e2e.tester.army ; Bun Rust rewrite https://bun.com/blog/bun-in-rust ; Crimsonland matching decomp https://github.com/banteg/crimson ; Mitchell Hashimoto on Ghostty vs Kitty; Fingerprint.com pixel-diff demo.
- Folder: **reading-notes/** (verification / agent evals; not ux, poteto-advice, or formal-verification).
- Diagrams from the skills repo: `ray-amjad-prove-it-loop.png`, `ray-amjad-verifier-parts.png`.

## Verdict (lead)

**Yes, interesting for Sam's GHCP factory, with marketing wrapping.** The useful core is the same shift Anthropic's platform team described on Latent Space: when agents write the code, humans spend scarce attention on the **plan** and on a **verifier the implementing agent did not author**. Ray packages that as three MIT skills (`create-prove-it`, `maintain-prove-it`, `audit-prove-it`). Steal the answer-key ladder and the mutation-audit idea; treat "TOP 1%", cohort upsell, and his "deleted hundreds of thousands of test lines" stories as author branding until you measure your own catch rate. Do not replace Actions unit tests blindly with agentic E2E.

## What is interesting (with rough times)

| Time | Point |
|---|---|
| 00:00 to 00:36 | Frames Anthropic's huge merge rate: engineers are not line-reading everything; plan + verification matter more. Cohort teaser. |
| 00:37 to 01:48 | Latent Space story: Messages API **Python to Rust**, no Rusters on the team at start; Claude wrote code; humans owned plan and verifier; **shadow traffic** old vs new until match; claimed **40 to 50% CPU** drop. |
| 01:48 to 02:43 | Mental shift: stop asking "how do I make the agent write better tests?" Ask "what is the verifier for this change?" Agent-written unit tests often restate the code; UI still broken. |
| 02:43 to 03:38 | Verifier = **surface** (where a user meets the change) + **answer key** (right looks like; not written by the builder) + **comparison**. |
| 03:38 to 04:53 | Answer-key ladder: old system (best) > snapshot > independent suite (e.g. Playwright) > acceptance table in a spec > none (worst). |
| 04:53 to 07:23 | Agentic E2E via **e2e.tester.army**: separate act agent vs assert agent; mix deterministic expects; caching when green. Author claims big test deletions replaced by E2E (unverified). |
| 07:23 to 08:13 | Three jobs: build verifiers, keep them from going stale, audit that they still catch bugs. Skills: create / maintain / audit prove-it. |
| 08:13 to 11:08 | Live `/create-prove-it` demo (MCP surface on Impello; Go to Rust migration brainstorm). Shadow API called out as high setup cost, high realism. |
| 11:08 to 11:40 | Bun Zig to Rust: TypeScript test suite as language-independent answer key; hill-climb to full green. |
| 11:40 to 13:41 | Byte-for-byte equality (matching decomp; Ghostty vs Kitty); pixel diffs as answer keys (Fingerprint clone demo). |
| 13:41 to 15:26 | New features: spec behaviours become E2E after implement. Real Slack + video receipts for Mac/Windows verifier loops. |
| 15:26 to 17:30 | Maintain: Safari video bug missed because prove skill only used Chromium; fix upstream in the skill (WebKit + real Mac). Feed Sentry/user bugs back into the skill, not only into one-off prompts. |
| 17:30 to 18:16 | Audit: mutation testing; plant a realistic bug; blind fresh agent runs prove skill; miss means fix the skill. |
| 18:16 to end | Close: ask "what is the verifier?" before big changes; humans review videos/HTML more than diffs. Newsletter/skills CTA. |

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| Anthropic merges tens of thousands of changes per day | **Directionally true in Anthropic's own post** (about 2,500/day May 2026 to over 30,000/day by Sep 2026). Chart is about merge volume and Scion, not "nobody reads code". | https://www.anthropic.com/research/redesigning-source-control |
| Messages API rewritten Python to Rust; no Rust developers at start; plan + verification mattered most; shadow traffic; ~40 to 50% CPU | **Matches Latent Space interview** (Katelyn Lesse / platform eng). Latency 10 to 20% TTFT also stated there; video leans on CPU. "Diffs fed back to Claude until match" is Ray's plausible reconstruction ("I imagine"). | Latent Space episode linked in description |
| Bun rewrite used language-independent TS tests as the verifier | **True in Bun's blog.** Suite does not depend on Zig vs Rust; goal was full pass with none skipped/deleted. | https://bun.com/blog/bun-in-rust |
| e2e.tester.army exists as OSS agentic E2E with act/assert split and replay cache | **True** (site live; TypeScript framework). Quality and cost for Sam's stack unproven here. | https://e2e.tester.army |
| Prove It skills (create / maintain / audit) are real and MIT | **True**, small repo (~35★), README says **beta**. | https://github.com/ray-amjad/skills |
| Deleted 110k and 295k lines of tests, caught more bugs per PR | **Author anecdote only.** No public PR links in the captions we have. | Unverified |
| "Almost nobody at Anthropic or OpenAI reads every line" | **Inference / hype.** Merge-rate post and Latent Space support "verification over line-by-line", not a quote that nobody reads code. | Framing |
| Title "TOP 1%" | **Marketing.** | Title |

## What to steal vs skip

**Steal**
- Before a big change: force the agent (or a human) to name surface, answer key, and comparison.
- Prefer old-system parity or snapshots for refactors; prefer independent E2E or hard acceptance tables for new behaviour.
- Keep answer keys out of the builder agent's hands; broken verdict goes back to the builder, never "fix the expected value".
- Maintain verifiers from production misses (browser matrix, real devices).
- Periodically mutation-audit agentic verifiers (plant bug, blind check).
- Optional: try `/create-prove-it` on one factory surface as an experiment.

**Skip / caveats**
- Do not mass-delete unit/integration tests because a YouTuber did.
- Agentic E2E is slower, flakier, and costlier than deterministic checks; use it where users meet the change.
- Cohort, Impello, and "TOP 1%" are sales around a real idea.
- Auto-captions may mangle names; prefer the linked primary posts for quotes.

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills / instructions** | Add create/maintain/audit prove-it (or a thinner factory twin). Standing rule: no "done" without a named verifier. Answer keys live in specs, snapshots, or old services, not in the coding agent's improvisation. |
| **Coding agent** | Builder loop: implement, run prove skill, on BROKEN fix product code only. Separate assert agent or Actions job from the builder where possible. |
| **Custom agents** | Optional "verifier" agent that only drives surfaces and compares to answer keys; never edits product to make checks pass. |
| **Actions** | Host deterministic parity, Playwright, mutation audits, and prove receipts as required checks. Seed caches; keep agentic E2E on a labelled job so cost is visible. |
| **Agentic Workflows** | On PR or after merge: run prove-<app>; on Sentry/user bug labels: run maintain-prove-it. Scheduled audit-prove-it weekly. |
| **Memory** | Store prove receipts (`.prove-it/runs/`) and which surfaces each change touched; feed misses into the skill, not only into chat memory. |
| **pstack** | Matches poteto-mode verify-before-trust. Plan + verifier is the human job; implementation is agent work. |

## Takeaway

Useful verification framing packaged as a short promo for Ray's skills and cohort. The Anthropic shadow-traffic story and the Bun language-independent suite are the strongest primary-backed examples. For Sam: adopt the answer-key discipline and a thin prove/maintain/audit loop in the GHCP factory; keep deterministic Actions gates; treat agentic E2E as a complement, not a wholesale test replacement.
