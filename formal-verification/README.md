# Formal verification

This section is for notes on proving software correct, not just testing it. For a software factory that leans on agents, that gap matters.

Agents can game tests, reviews and evals. A machine-checked proof cannot be gamed in the same way: either the theorem holds in the kernel or the build fails. Specs also shrink a task. Once the domain, invariant and contract are written down tightly enough, there is often only one plan that satisfies them. That fits poteto's pstack idea of turning work into sharp, reusable skills and instructions rather than open-ended prompts.

The $12 server Lean submission is a concrete case: a feed API specified in Lean 4, theorems checked on every build, and C generated from that spec so the hot path skips SQL and reads SQLite's B-trees under a proved invariant.

## Notes

- [Lean 4 derived C for the $12 server](2026-10-30-lean-twelve-dollar-server.md): Harsh Gupta's Lean-to-C feed server that took first place on Arjay McCandless's challenge by proving feed plans and emitting specialised C.
