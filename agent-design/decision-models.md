# Decision models (researched 27 Oct 2026)

## What they are
A new model class started by TypeSafe's Jev (released 15 Sep 2026); also called "System One" models.
Others: OpenAI Decisions API (GA 22 Oct), Microsoft-Decision-1 (9 Oct, in Foundry), Liquid d1, Cloudflare Clef, Perplexity Decider, open-weight Kev and Strands Decider.
You send context ("state") plus typed questions (pick one / yes-no / scale); one forward pass returns a calibrated probability per option.
No text, no code, no explanations, no step-by-step reasoning (by design). About $0.04 per 1M input tokens, ~0.1 s latency.
Exception: PostHog's open Jeeves 9B reasons before deciding.

## Accuracy
- System1-Arena (https://arxiv.org/html/2610.21244): 92k questions incl. code review, patch correctness, fault localisation, SWE-bench Verified controller. Best decision models ~73% (Decision-2.0-Vega-27B 73.0%, Jev 72.6%) vs fast LLM GPT-6 Luna 71.2% vs Claude Opus 5.5 with reasoning 81.1% (~70x the cost). Small decision models rarely succeed at multi-step tasks.
- Arize (https://arize.com/blog/decision-model-benchmark/): tool/skill routing, Jev 49/52; RAGTruth hallucination detection, Jev 85.5% balanced accuracy vs OpenAI 81.5%. Rewording flipped several models (Liquid 0.92 -> 0.17); only Jev, Clef and OpenAI stable.
- Artificial Analysis Decision Index: Jev 58, Microsoft-Decision-1 54; Claude Haiku 5.5 more accurate at much higher cost.
- Microsoft claim (unverified): "competitive with GPT-5.6 Luna and 100x faster".
- No benchmark found specifically for coding decisions with heavy repo context.

## Large grounding context hurts
Typical limit 32k tokens per question. Jev's 262k mode is labelled "Danger-Zone": slower and less accurate (https://docs.typesafe.ai/models).
Accuracy drops with irrelevant detail; very literal; weak at counting/maths; steerable by injected text (https://docs.typesafe.ai/model-jaggedness/jev-1.13.md).

## Use in our agent design
- Good for: routing (tool/skill/Copilot model), cheap allow/block/escalate pre-filter before auto-review, triage, judging retrieved passages one at a time.
- Filter context in code first; ask several small questions; never hand it a whole repo or diff.
- Keep a reasoning model for real approve/reject on code, multi-step work, anything needing a written reason.
- Test exact question wording both ways on labelled data; pin model version before tuning thresholds.
- Not on GitHub Copilot's model list. Microsoft-Decision-1 is in Foundry (https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-microsoft-decision); needs the same Copilot-only policy check.
- Community router on Microsoft-Decision-1 for Copilot: https://notanarchitect.io/one-decision-per-turn-a-minimal-decision-router-for-github-copilot-in-cli-and-vs-code/
