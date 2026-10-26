# React: banning `useEffect`

## Why (poteto)

From the live session (CI chapter): "if you've written any React for example you know … one of the biggest foot guns in React is use effect. Uh so in uh Dune and in [Grok Bot] we've banned use effect … CI will fail uh and yell at you." Dune is her agent-friendly framework behind Grok Bot. She describes it as "like Next.js for … electron apps and it's designed for agents to write".

A post Sam bookmarked summarises the same session ([@0xWaunty](https://x.com/0xWaunty/status/2110007607494672584)): "ban the bad patterns in CI - no useEffect, no code comments, no cross-thread imports".

poteto is on the React compiler core team, so this is not a dislike of React. Effects are where agents put state syncing, fetch waterfalls and race-condition workarounds, and an agent copies the nearest example. That makes them a good fit for "make it impossible, then name the right way".

## What to use instead

These follow the React docs' "You Might Not Need an Effect" guidance.

| You wanted to… | Do this instead |
|---|---|
| Compute something from props/state | Compute it during render. Use `useMemo` only if it's measurably slow. (With the React compiler, plain code is memoised for you.) |
| React to a user action (submit, click) | Do the work in the event handler |
| Fetch data | The data library: TanStack Query `useQuery`, or SWR, Relay, or a router loader. Never `useEffect(() => { fetch… }, [])`. |
| Reset state when a prop changes | Give the component a `key`: `<Editor key={docId} />` |
| Adjust some state when a prop changes | Store the previous prop and compare during render, or better, derive it |
| Subscribe to an external store (browser API, websocket, global store) | `useSyncExternalStore`, via the `useSubscription` wrapper |
| Genuinely sync with a non-React system on mount (focus a widget, start an analytics session, integrate a third-party DOM library) | The `useMountEffect` wrapper |
| Notify the parent of a change | Call the parent's callback in the same event handler that changed the state |

## Allowed wrappers **[Chief]**

Keep the escape hatch, but make it narrow and named. The two files below are the only places that may import `useEffect`. The lint config switches the ban off for exactly these paths.

`examples/hooks/useMountEffect.ts`:

```ts
import { useEffect } from 'react';

export function useMountEffect(effect: () => void | (() => void)): void {
  useEffect(effect, []);
}
```

`examples/hooks/useSubscription.ts`:

```ts
import { useSyncExternalStore } from 'react';

export interface ExternalStore<T> {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => T;
}

export function useSubscription<T>(store: ExternalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
```

There is deliberately no `useEffectWithDeps`. Dependency-driven effects are what you are trying to remove. If a real case turns up, add a new named wrapper with a clear contract, and review it as an architecture change.

`eslint-plugin-react-hooks`' `exhaustive-deps` will flag `useEffect(effect, [])` inside `useMountEffect`. Disable it for that file in the same override block.

## Lint config

From `examples/eslint.config.mjs`. This has been tested: it flags both the named import and `React.useEffect`.

```js
const EFFECT_MESSAGE =
  'useEffect is banned. Derive the value during render, do the work in the event handler, use the data library (e.g. TanStack Query) for fetching, useSyncExternalStore for subscriptions, or a `key` to reset state. If you need to sync with a non-React system, use the wrappers in src/lib/hooks (useMountEffect, useSubscription).';

rules: {
  'no-restricted-imports': ['error', {
    paths: [
      { name: 'react', importNames: ['useEffect', 'useLayoutEffect'], message: EFFECT_MESSAGE },
    ],
  }],
  'no-restricted-syntax': ['error',
    { selector: "MemberExpression[object.name='React'][property.name=/^use(Layout)?Effect$/]", message: EFFECT_MESSAGE },
  ],
},

{
  files: ['src/lib/hooks/useMountEffect.ts', 'src/lib/hooks/useSubscription.ts'],
  rules: { 'no-restricted-imports': 'off', 'no-restricted-syntax': 'off' },
},
```

Notes:

- `no-restricted-imports` catches `import { useEffect } from 'react'`. `no-restricted-syntax` catches `React.useEffect(...)` when React is imported as a namespace or default.
- If your codebase re-exports React from a local module, add that module path to `paths` as well.
- In a legacy codebase with hundreds of effects, turn the rule on and baseline the existing violations (see [lint-rules.md](lint-rules.md)). Only new effects fail. Then send migration PRs folder by folder.
- The same pattern works for other foot-guns. Examples: ban `useLayoutEffect`, `dangerouslySetInnerHTML` (`JSXAttribute[name.name='dangerouslySetInnerHTML']`), or importing a legacy state store.

## Structure helps too (poteto)

- Features are co-located in one folder, so "for 80% of the work, it's mostly just very encapsulated there" (live session).
- Boundaries are enforced through the import graph (main vs renderer in Electron).
- **[Chief]** With the `no-restricted-imports` `patterns` option you can do the same in a React app: block `**/internal/**` and `**/legacy/**`, so features talk only through their `index.ts`. For more complex graphs, use `eslint-plugin-boundaries` or `dependency-cruiser`.
