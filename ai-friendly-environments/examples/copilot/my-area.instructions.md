---
applyTo: "src/features/my-area/**"
---

# my-area rules

Most rules here are enforced by lint, types or CI. This file only lists them so you know what will fail, and covers the few judgement calls.

| Rule | Enforced by | Added |
|---|---|---|
| No `useEffect` / `useLayoutEffect`; use `useMountEffect` or `useSubscription` from `src/lib/hooks` | `no-restricted-imports`, `no-restricted-syntax` | 2026-10 |
| No code comments, except `quirk: <bug link>` | `local/no-comments` | 2026-10 |
| No `any`, `@ts-ignore`, `as unknown as` | typescript-eslint, `no-restricted-syntax` | 2026-10 |
| No `.only` / `.skip`, no deleting tests, no new ESLint suppressions | `scripts/check-agent-gaming.mjs` (pre-commit + PR build) | 2026-10 |

Judgement calls (not enforceable yet):

- Prefer extending an existing component in `components/` over creating a near-duplicate.
- Split work into PRs that each do one thing; put a "Review in this order" list in the description when PRs are stacked.
