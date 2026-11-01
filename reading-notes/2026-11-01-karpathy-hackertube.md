# @karpathy: HackerTube (HN-recommended YouTube, agent-built in ~2 hours)

- Source: https://x.com/karpathy/status/2116957135661945283 (1 Nov 2026, 18:14 UTC / 18:14 Europe/London). Long post (note_tweet). Screenshot of the site attached. Metrics at fetch: about 7.1k likes, 5.1k bookmarks, 540 reposts, 445 replies, ~260k impressions (still climbing).
- Author: **@karpathy** (Andrej Karpathy). Same project as his blog post the day before: https://karpathy.bearblog.dev/hacker-tube/ (31 Oct 2026).
- Site: https://hackertube.org/ (live). About: https://hackertube.org/about. Data export: https://hackertube.org/data (17.8 MB zip `hackertube-data.zip`, ODC-By 1.0).
- Image saved: `2026-11-01-karpathy-hackertube.jpg` (tweet screenshot of the HackerTube UI).
- Notable reply thread: **@eyadnour** joked that reading 43M HN comments would traumatise the agent (https://x.com/eyadnour/status/2116959158826320083, ~100 likes). **@karpathy** clarified: cheap Claude pass with urls/regexes/spam drop first; only the remainder went to **Sonnet** via a Claude Code Workflow on sub tokens (https://x.com/karpathy/status/2116970707867566106).
- Related earlier notes: Ray Amjad Prove It / verifiers; DeepSeekHarness super-agent; agent-evals maps. Not formal methods; UI is a byproduct, not an agent-UX design post, so **reading-notes/**.
- Sam's project is on GitHub: GHCP mapping only (no ADO).

## Verdict (lead)

**Real shipped artefact, real reusable dataset, process claim is the headline.** HackerTube is live: 6,454 videos ranked from lasting HN recommendations, mid-video thumbnails, local-only likes/history, and an agent-oriented zip with `DATA.md`. That checks out against the site, about page, download, and `DATA.md`. The "~2 hours with Opus 5.5" and "I don't do traditional engineering anymore" lines are **author process narrative**, not a reproducible benchmark; treat them as "what an expert prompter with API/VPS/domain chores still in human hands can few-shot," not a promise that every GHCP factory change ships in two hours. Steal the pattern: public archive as taste filter, cheap deterministic pre-filter then LLM label, ship a forkable data pack with agent docs, keep human gates on secrets and infra.

## What he shipped

### Product
YouTube-shaped browser for videos HN people keep recommending (2007 to 2026). Features called out in the tweet and about page:
- Recs without logins (state in the browser session).
- Thumbnail from a mid-video auto frame (`hq2.jpg`) instead of the uploader's clickbait custom thumb.
- "HackerTube Longs" (long-form filter).
- Categories, playlists, hidden gems, evergreen, keyboard shortcuts, privacy-enhanced YouTube embeds.
- Hover explains why a card is on Home (classics, hidden gems, recent HN, similar, co-recommended by same HN people).

### Pipeline (from about + DATA.md)
1. Scan the public HN archive (credits Hugging Face `open-index/hacker-news`) for YouTube links.
2. Keep videos with lasting signal: at least three different people with real commentary in at least three different months (roughly 7k before LLM pass).
3. LLM labels each surviving comment's stance (recommend, strong recommend, reference, joke, critical), quote, topics.
4. LLM writes video cards (summary, why HN likes it, type, shelf life) and a shared taxonomy (16 areas, 150 topics).
5. Rank by lasting recommendations (distinct months; strong recs count extra), not one viral spike.

Export (exported 2026-10-31): `videos.jsonl` (6,454), `mentions.jsonl` (39,834), `taxonomy.json`, `related.jsonl`, `embeddings.npy` (bge-small 384-d), `DATA.md`. YouTube descriptions/views/durations are **not** redistributed (API terms); ids are there so an agent can fetch them.

### Process claim (tweet + blog EDIT)
- Tooling: Claude Code desktop on Mac; **Opus 5.5 Medium** as default; Sonnet Workflow for bulk comment labelling.
- Human-only chores (likened to MenuGen): Google Cloud YouTube API key UI, boot a VPS, buy the domain. Then give Claude the IP and tell it to update, secure, harden, deploy, optimise.
- Closing line: many projects that used to take weeks or months can now be few-shotted for breakfast; "what else are we not thinking of?"

## Claims check

| Claim | Verdict | Primary check |
|---|---|---|
| hackertube.org is live with HN-filtered YouTube UI | **True** | https://hackertube.org/ |
| 6,454 videos; 39,834 labeled HN comments; 150 topics / 16 areas; 2007 to 2026 | **True** on about and data pages; zip Content-Length ~17.8 MB | https://hackertube.org/about , https://hackertube.org/data |
| Mid-video thumbnails instead of custom uploads | **True** (site/`DATA.md` use `hq2.jpg`; docs say middle-of-video auto frame) | DATA.md + site markup |
| Data zip + agent `DATA.md` downloadable under ODC-By 1.0 | **True** (HTTP 200 zip; license stated) | https://hackertube.org/download/hackertube-data.zip |
| Source archive is open-index/hacker-news on Hugging Face | **Linked and live** (dataset page loads; full 43M count not re-counted here) | https://huggingface.co/datasets/open-index/hacker-news |
| "43M comments" scanned down to 6,454 videos | **Directionally consistent, easy to misread.** Tweet's 43M is the full archive scan. Surviving labeled comments are ~40k (blog) / 39,834 (about). Videos are 6,454. Cheap regex/url/spam filter ran before Sonnet (Karpathy reply to @eyadnour). | Tweet vs about vs reply |
| Ranking prefers lasting months over viral spikes; min 3 people / 3 months | **Documented on about / DATA.md** (not independently re-run) | about, DATA.md |
| Built in ~2 hours with Opus 5.5 | **Author timing only.** Blog and tweet agree; no independent clock. Wall clock excludes prior taste, API account, and VPS skills. | Blog + tweet |
| Only manual work: API key UI, VPS, domain; Claude did the rest including harden/deploy | **Author process claim.** Plausible for this stack; security depth of "harden" not audited here. | Blog EDIT + tweet |
| "I don't actually do anything resembling traditional engineering anymore" | **Strong framing / mild hype** for a general audience. He still owns product taste, secret/infra gates, and acceptance. | Blog EDIT |
| Significantly better than YouTube recs | **Subjective taste claim** for an HN-shaped audience. Site exists; "better" is not measured. | Framing |
| Reminiscent of MenuGen | **True reference** to his earlier vibe-coded app write-up | https://karpathy.bearblog.dev/vibe-coding-menugen/ |

## What to steal vs skip

**Steal**
- Use a **community archive as a taste model** when platform recs optimise watch time you do not want.
- **Cheap deterministic pre-filter**, then spend LLM tokens only on the remainder (urls, regex, spam drop before Sonnet Workflow).
- Rank on **repeated independent recommendations over time**, not raw mention count from one thread.
- Ship a **fork pack**: jsonl + embeddings + `DATA.md` written for agents, with explicit gotchas (stance noise, shelf_life news, title dupes, capped mentions).
- Keep humans on **secrets and infra** (API keys, VPS, DNS); let the coding agent own the bulk of code, deploy scripts, and UI.
- Mid-content thumbnails / anti-clickbait presentation when the factory surfaces demos or talk libraries.

**Skip / caveats**
- Do not treat "~2 hours" as a factory SLO. Karpathy is an outlier operator on a greenfield toy with clear taste.
- Do not paste "harden and deploy" without Actions checks, secrets scanning, and a human pass on the VPS.
- HN taste is a specific filter (tech/startup-heavy); not a universal content policy.
- LLM stance labels and summaries: DATA.md itself warns a few percent will be wrong.
- One weekend demo is not a maintained product (update cadence for new HN threads unanswered in the thread).

## GHCP / pstack angle (GitHub only; skip ADO)

| Piece | Fit |
|---|---|
| **Skills / instructions** | "Archive to product" skill: given a public dump, document the cheap filter, the LLM label schema, and the export layout. Require a `DATA.md` (or factory twin) whenever an agent produces a reusable dataset. Standing rule: humans create API keys and approve deploy targets. |
| **Coding agent** | Karpathy-style: talk to the agent for implementation and deploy scripts; human stays in the browser for Cloud consoles and DNS. Prefer Workflows/subagents for bulk labelling (Sonnet) under an Opus (or factory equivalent) coordinator. |
| **Custom agents** | Optional "labeler" agent that only applies stance/schema to pre-filtered rows; optional "card writer" for summaries; neither owns prod credentials. |
| **Actions** | Gate any "secure, harden, deploy" agent output: SAST, dependency audit, secret scan, smoke test of the static/site job before SSH/VPS steps. Publish data zips as release artefacts with licence and schema checksums. |
| **Agentic Workflows** | Scheduled re-scan of HN (or other archives) to refresh mentions; PR that updates jsonl + regenerates embeddings; human merge before prod. |
| **Memory** | Store which archives, filter thresholds (e.g. 3 people / 3 months), and stance enums the factory trusts; do not store API keys in Memory. |
| **pstack** | Matches poteto "verify before trust": the zip + `DATA.md` is the answer key for forks; the live site is the demo. Few-shot breakfast projects still need a named verifier (smoke URL, row counts, licence) before you call them done. |

## Takeaway

HackerTube is a concrete proof that an agent-led weekend can turn a public comment archive into a polished, forkable media browser, with the heavy LLM spend scoped by a cheap filter and the human still holding keys and the server. For Sam's GHCP factory: copy the data-pack-for-agents habit, the pre-filter then label pattern, and the human gate on secrets/deploy; do not copy the myth that every useful change is a two-hour Opus breakfast.
