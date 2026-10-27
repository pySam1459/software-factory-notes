# Cheap code, precious trust: code modernization at scale (Microsoft, 26 Oct 2026)

- Post: https://x.com/msdev/status/2114796323581136912
- Article: https://commandline.microsoft.com/agentic-software-engineering-large-scale-code-migration-language-modernization-spec-driven-development/
- Authors: Sriram Rajamani and Tim Bozarth (CVPs, CoreAI). First post in a series.

## Thesis
Generating code is now the easy part; the hard part is trusting it. Human attention is the scarcest resource, so tools should spend it where it matters most.

## Key points
- **Inversion of control.** They started with hard-coded workflows calling LLMs as subroutines. By May 2025 agents planned better than the pipelines, so the job became building tools agents call. The most valuable tools tell the agent whether a change is right.
- **Migration: approve knowledge, not fixes.** Agents learn a candidate knowledge base from sampled findings. A reviewer agent scores fixes for correctness, minimality, consistency with file conventions and maintainability. A small expert team approves the knowledge base, then agents apply it across the codebase. Similar fixes are grouped for review. Examples: Windows to Clang/LLVM (hundreds of millions of lines), CodeQL/PREfast/Roslyn remediation, x86 to ARM.
- **Language modernization (C/C++ to Rust).** Migrate feature by feature, not line by line, with a validation gate per feature. Uses differential testing (source vs target behaviour), held-out tests the agent never sees so it can't overfit, and Verus proofs against specs extracted from the source.
- **Spec-driven development.** Agents infer TLA+ specs from existing code. TLC checks implementation traces against them. Properties are proved in F*/Lean via a TLA+ compiler. Engineers approve properties and agents find the invariants.
- **Open questions.** Can we trust AI-written specs (what the code *should* do vs what it *does*)? Verifying security, performance and reliability? Will engineers stop reading code? Who owns code when any agent can change anything?

## Takeaways for us
- Matches poteto: invest in the environment and verification tools, not the prompt.
- "Approve the knowledge base, not each fix" is the same shape as traits: approve the rule once, apply everywhere.
- Held-out tests are an anti-gaming tool alongside `scripts/check-agent-gaming.mjs`.
- Usable now on the Python/TS project: per-feature validation gates, differential tests for rewrites, a reviewer agent scoring against explicit criteria. The formal-methods parts mostly suit Windows/Azure scale.
- Useful internal Microsoft backing when pitching agent workflows to the team.
