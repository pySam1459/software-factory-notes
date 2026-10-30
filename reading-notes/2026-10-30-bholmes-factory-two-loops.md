# Ben Holmes: self-improvement and benchmarking loops for a software factory

- Source: https://x.com/BHolmesDev/status/2116224247056273893 (30 Oct 2026, 17:42 Europe/London / GMT, @BHolmesDev / Ben Holmes, "Whiteboard Guy and Factory Foreman" @warpdotdev). Full note_tweet + one diagram image (`/workspace/bholmes-imgs/loops.jpg`). No video. No quoted post.
- Author reply: https://x.com/BHolmesDev/status/2116224248943702086 — points self-improvement at Warp **Skill Doctor** (https://www.warp.dev/skill-doctor); benchmarking "rhymes with Shmarp Shmactories" (Warp Factories pitch).
- Skill source: https://github.com/warpdotdev/common-skills (path `.agents/skills/skill-doctor/`). Install examples elsewhere: `npx skills add warpdotdev/common-skills --skill skill-doctor -a claude-code` (or `-a codex`).
- Relation to GitHub Next AW GA post (https://x.com/GitHubNext/status/2116220286928585103, 17:26 Europe/London same day): **not linked**. Ben does not quote or reply to GitHubNext; no shared media or URLs. Same-day adjacent theme (agent/factory automation) only. See sibling note `2026-10-30-github-agentic-workflows-ga.md`.

## What the post says
Two loops around a "core factory loop":

1. **Self-improvement** (quality up): score agent conversations with LLM-as-a-judge, then review poor performers and propose skill/prompt edits.
2. **Benchmarking** (cost down): replay past conversations against different model selections, grade with LLM-as-a-judge, pick a winner.

Combined claim: better factory quality and lower factory cost.

## Diagram (readable from image + alt text)
Left, orange **Self-improvement loop**: Review agent conversations → Score quality (rubrics: efficiency ✓, code quality ✓, test coverage ✗) → Isolate failures ("5 conversations wrote redundant tests") → Propose improvements every 24h → example diff on `test-writing/SKILL.md` (+Coverage pyramid; when to add unit vs integration tests; shown as +59/−20 in the graphic).

Right, green **Benchmark loop**: Sample past conversations → Benchmark Claude / Grok / GPT / GLM on task scores → Pick winner on cost vs performance → Deploy model changes → example: PR review agent swaps `model: frontier` for `model: open-weight`.

## Skill Doctor (linked product / open skill)
From warp.dev/skill-doctor and the repo SKILL.md (read on GitHub raw):

- Runs locally against Claude Code, Codex, or Warp conversation history. **Never upload transcripts**; only the user-chosen report is shareable.
- Loop: Aggregate transcripts → Score with rubric scorers → Propose merge-ready skill edits (writes proposals under a temp `REPORT_DIR`, does not silently rewrite live skills).
- SKILL.md scorers listed: efficiency, code quality, procedure compliance, verbosity; overall is a weighted mix plus `skill_coverage`. Marketing page also shows "skill coverage" on the sample card; diagram used "test coverage" as a failed rubric example.
- Failed conversations (any applicable raw score < 0.5) drive suggestions; drafts land as diffs under `proposed/`.
- CTA on the report: Warp Factories for team-wide continuous self-improvement, configurable metrics, repo-task benchmarking, velocity/cost dashboards. Anonymous quote on the page: "warp factories drove our cost per agent pr down by 30%." Treat as marketing.

## Thread replies worth noting (not author claims)
Useful pushback in the conversation, unanswered by Ben at fetch time:
- Freeze tool outputs when replaying, or you compare environments not models (@metehanariman).
- Don't let both loops share one judge; a file-opening re-judge flipped 94.9 → 5.8 in one cited case (@verbal72 / Odysseys2).
- Human-approve skill diffs; require a pattern across a milestone, not one bad chat (@imfabiokeller).
- Risk of rewriting SKILL.md to please the judge rather than real outcomes (@asmirkn).
- Replay distribution misses novel prod prompts (@dusangran); multi-turn replay drifts because the user replied to the old model (@DanielLenton1).

## Worth keeping (pstack + GHCP software factory)

| Idea | GHCP / pstack move |
|---|---|
| Score past coding-agent chats on rubrics | **Custom agent** or coding/cloud agent run that reads local session logs (or ADO/GH conversation exports you already keep) against standing **skills**/rubric files. Closest open starting point today is Warp's skill-doctor skill; port rubrics into repo skills rather than depending on Warp Factories. |
| Propose SKILL.md / instruction diffs from failures only | Output as PRs; human **Actions** (merge) gate. Matches poteto "agents don't grade their own work" and Ondrej writer≠reviewer. Do not auto-apply. |
| 24h improvement cadence | **Copilot Automations** / **Agentic Workflows** scheduled job that samples failures and opens skill PRs. |
| Replay past tasks across models; pick on cost×quality | Eval harness as a skill + **Agentic Workflows**; store frozen tool/fixture outputs with the transcript. Map winners into custom-agent model settings (frontier for hard review, cheaper open-weight for triage). |
| Separate judge from builder | Distinct **custom agents**: builder vs judge vs skill-editor. Prefer a judge that can open delivered artefacts (files, CI), not only chat text. Hand-score a sample of judge calls so Memory/instructions don't drift with a weak judge. |
| Benchmark drives cost down | Same shape as pstack trust curve: prove local verification, then downgrade models on measured tasks. |

For the MSFT Copilot-only factory: steal the two-loop *shape* (score→propose skills; replay→pick models), wire it through GHCP skills + Agentic Workflows/Automations + human merge Actions. Skill Doctor itself targets Claude/Codex/Warp session stores; do not assume it reads Copilot session history without checking. Warp Factories is optional paid infra; the open skill is the portable bit.

## Caveats
- Post + diagram + author reply + Skill Doctor page/SKILL.md were read. No video on the post.
- "Shmarp Shmactories" is a wink at Warp Factories, not a second open tool.
- Sample report scores and the 30% cost-per-PR quote are Warp marketing; not independently verified here.
- LLM-as-a-judge for both loops is the structural risk the thread calls out; pstack wants a check that can fail for real (CI, proofs, human sample), not only another model.
- Unrelated to the same-day GitHub Agentic Workflows GA announcement except as competing "factory" vocabulary.

## Takeaway
Two concrete factory loops: grade real conversations and edit skills from failures; replay those conversations across models and pick on cost vs quality. Implement with GHCP custom agents, rubric skills, scheduled Agentic Workflows/Automations that open PRs, and human Actions on merge. Keep judge ≠ builder, freeze tool outputs for fair replay, and do not let Skill Doctor (or any auto-editor) rewrite instructions without a human gate.
