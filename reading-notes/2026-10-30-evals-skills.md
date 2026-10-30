# ai-evals-course/evals-skills: product-eval skills for coding agents

- Repo: https://github.com/ai-evals-course/evals-skills (org **AI Evals Course**, `ai-evals-course`; ~1632 stars at fetch; default branch `main`; created 2026-06-23).
- Who: plugin manifests name authors **Shreya Shankar and Hamel Husain**. Org blog/homepage: https://maven.com/parlance-labs/evals (Maven **AI Evals** course). README links Hamel’s eval notes/blog (hamel.dev) and “Shreya’s walkthrough” for error-discovery (https://youtu.be/tqUDjc1HzO4). Shallow clone showed Hamel Husain as merge committer. Confirms the Parlance Labs / AI Evals course pair rather than a random org name.
- Licence: **Apache License 2.0** (`LICENSE`; GitHub `apache-2.0`). Standard Apache text; appendix copyright placeholder not filled with a personal name.
- Version in plugin JSON: **0.3.1**.
- Install (README): `npx skills add https://github.com/ai-evals-course/evals-skills` ([vercel-labs/skills](https://github.com/vercel-labs/skills)); one skill: add `--skill error-discovery`; update via `npx skills check` / `npx skills update`. Also ships Claude (`.claude-plugin/`) and Codex (`.codex-plugin/` + per-skill `agents/openai.yaml`) plugin metadata.
- Scope: **product-specific** LLM evals (not foundation-model leaderboards). README: skills guard footguns seen helping 50+ companies and teaching the course.
- Related notes: @ashpreetbedi’s simulations / traces / evals — `2026-10-30-ashpreetbedi-simulations-traces-evals.md`; 14-point evals list — `/workspace/notes-out/evals/2026-10-29-evals-underrated-skill.md`; Ben Holmes factory loops — `2026-10-30-bholmes-factory-two-loops.md`.
- Read this turn: README, LICENSE, both plugin JSON trees, every `skills/*/SKILL.md`, `error-discovery/review-loop.md`, sample `agents/openai.yaml`, `workflow.png` present (error-discovery diagram; not re-interpreted beyond README caption).

## Layout and format
Nine skills under `skills/<name>/SKILL.md`. Each has YAML frontmatter with `name` and `description` (Agent Skills shape). Every skill also has `agents/openai.yaml` (Codex display name / default prompt / `allow_implicit_invocation`). `error-discovery` adds `review-loop.md` for the interactive phase. No Copilot-specific plugin folder in-repo.

## Skills (one line each)

| Skill | What it does |
|---|---|
| **evals-start** | Router only: match the user’s situation to another skill in this set and load that workflow end-to-end. |
| **eval-audit** | Inspect an existing eval pipeline across six areas (error analysis, evaluator design, judge validation, human review, labeled data, pipeline hygiene) and report prioritized findings with next skills. |
| **error-discovery** | Interactive error analysis: study a JSON/CSV/JSONL of traces, build a dependency-free HTML review app + Python stdlib server, cluster/sample diversely, then loop while a human annotates into failure modes (`review-loop.md`). |
| **generate-synthetic-data** | Bootstrap ~100 diverse traces via failure-targeted dimensions → user-reviewed tuples → LLM queries → run through the real pipeline (or stratified sample real queries). |
| **write-code-eval** | Turn one objective failure mode into a code check (schema, regex, citation IDs, tool args, reference compare); leave interpretive rules to a judge. |
| **write-judge-prompt** | Design a **binary** Pass/Fail LLM judge for one subjective failure mode: criterion, Pass/Fail defs, few-shots, critique-before-verdict structured output. |
| **validate-evaluator** | Calibrate a judge on human labels (train/dev/test), target TPR/TNR > 90% on dev, measure once on test, optional Rogan-Gladen bias correction for production pass rates. |
| **evaluate-rag** | After end-to-end error analysis, split retrieval vs generation: Recall@k (and Precision/MRR/NDCG for rerank), faithfulness/relevance for answers; fix retrieval/chunking before generation. |
| **build-review-interface** | Build a custom single-file annotation UI (Pass/Fail, notes, defer, domain-native rendering) when you need a labeling tool outside the full error-discovery loop. |

README stresses **error-discovery first**: only write evals after qualitative failure modes exist. Watch linked: Shreya’s walkthrough for that skill.

## Intended workflow (from README + evals-start)
- Have traces, no taxonomy → `error-discovery`.
- Have a pipeline, unsure if trustworthy → `eval-audit`.
- No traces yet → `generate-synthetic-data`, then `error-discovery`.
- Known objective failure → `write-code-eval`; subjective → `write-judge-prompt` then `validate-evaluator`.
- RAG-specific → `evaluate-rag` (still after error analysis).

## Copilot factory fit (GitHub only; no ADO)
**Format:** Each skill is a standard `SKILL.md` with `name` + `description` frontmatter, which matches the Agent Skills convention Copilot custom agents / skills consume. Codex extras (`agents/openai.yaml`) and Claude plugin JSON are harness packaging; they are not required to use the markdown workflows. Install path documented is `npx skills add …`; for Copilot, drop or sync the `skills/` tree into whatever skills directory your Copilot agent harness reads (confirm current Copilot path when installing — the repo does not document a Copilot-specific install).

| Piece | How it lands in GHCP |
|---|---|
| `evals-start` / specialized skills | Repo **skills** (and optional **custom agents** that only run eval workflows). Prefer invoking named skills over a vague “do evals” prompt. |
| `error-discovery` / `build-review-interface` | Interactive **coding agent** sessions (HTML app + local server). Not a good unattended Automation until labels exist. |
| `generate-synthetic-data` | Coding agent produces inputs; run them through your product/agent under test; store traces in-repo or object storage. |
| `write-code-eval` | Deterministic checks → wire into CI **Actions** as the hard gate (pstack “check that can fail”). |
| `write-judge-prompt` + `validate-evaluator` | Judge prompts as versioned files; validation notebooks/scripts as PRs. Do not put unvalidated judges on the merge gate. Aligns with Holmes: judge ≠ builder, and shared-judge risk. |
| Eval suite green/red | **Actions** on PRs that touch prompts, tools, retrieval, or agent skills. Optional **Agentic Workflows** / **Automations** to sample production traces nightly and open “new failure mode” issues, then humans run error-discovery. |
| Standing policy | **Custom instructions** / **Memory**: error analysis before metrics; binary judges; code before LLM judges; re-audit after model/prompt changes. |

## pstack angle
Same trust curve: qualitative error analysis and verification skills before scaling agents. Code evals and CI Actions are hard constraints; LLM judges are soft until TPR/TNR-validated. Matches poteto “agents don’t grade their own work” (separate judge, human labels from domain experts) and the earlier 14-point list (error analysis first, deterministic assertions, train/dev/test for judges, CI gates). Ashpreet’s three buckets map cleanly: simulations ≈ `generate-synthetic-data` + probes; traces ≈ `error-discovery`; evaluations ≈ `write-code-eval` / `write-judge-prompt` / `validate-evaluator` / CI.

## Caveats
- Course promo links and “50+ companies” claim are README marketing; skills content is what was verified.
- `error-discovery` is explicitly **interactive only**; do not pretend it is a headless CI job.
- Video walkthrough linked, not watched this turn.
- Rogan-Gladen and TPR/TNR thresholds are as stated in `validate-evaluator`; treat as their methodology, not independently re-derived here.
- Apache-2.0: fine for private factory use; keep attribution on redistribution.

## Takeaway
Install the Hamel/Shreya evals skill pack when you want coding agents to follow a real product-eval playbook: discover failures on traces, prefer code checks, build binary judges only when needed, validate them, then gate with Actions. Drop-in as Copilot skills via the standard SKILL.md shape; keep interactive discovery in human sessions and put only deterministic (or validated) evals on the merge path.
