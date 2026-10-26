# Example traits

These are **examples** written by Chief for Sam's Python + TypeScript stack, not rules anyone has agreed on. They use the traits.sh format. To adopt one, copy it into the project's `.agents/traits/` and edit it to match what you actually want.

| File | Stack |
|---|---|
| [no-derived-state-in-effects.md](no-derived-state-in-effects.md) | React / TS |
| [validate-at-api-boundaries.md](validate-at-api-boundaries.md) | Python (FastAPI + Pydantic) |
| [colocate-small-domain-errors.md](colocate-small-domain-errors.md) | Python (adapted from the traits.sh example) |
| [name-after-the-feature.md](name-after-the-feature.md) | Both |

`no-derived-state-in-effects` is partly lint-enforceable (see [react.md](../../react.md)). It's here as a trait for the cases the lint rule can't see, such as a `useMountEffect` that only copies props into state.
