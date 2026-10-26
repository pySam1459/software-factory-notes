# TypeScript strictness

Types are the second level of the pyramid. They are deterministic, cheap to run, and the agent gets the feedback straight away.

- Minsky, as summarised by poteto ([26 Oct](https://x.com/poteto/status/2114626630429913383)): "agents thrive on feedback, and types are one of the best kinds", and "make illegal states unrepresentable with types, and it enforces global rules across your codebase". ("Make illegal states unrepresentable" is Minsky's own phrase; he says in the talk that he coined it by accident.)
- pstack's "Type System Discipline" principle: "makes illegal states unrepresentable". "Boundary Discipline": "validates at the boundary and trusts internal types".

## Strict tsconfig

`examples/tsconfig.strict.json`:

| Flag | What it catches |
|---|---|
| `strict` | Enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict` |
| `noUncheckedIndexedAccess` | `arr[i]` and `record[key]` are `T \| undefined`. This is the biggest win in legacy code, and also the noisiest. |
| `exactOptionalPropertyTypes` | `{ a?: string }` no longer accepts `{ a: undefined }` |
| `noImplicitOverride` | Overriding a class member requires `override` |
| `noImplicitReturns` / `noFallthroughCasesInSwitch` | Every code path returns, and no accidental fall-through |
| `noPropertyAccessFromIndexSignature` | Index-signature keys must use `obj["key"]`, which makes it obvious the key may not exist |
| `noUnusedLocals` / `noUnusedParameters` | Dead code that agents would otherwise copy |
| `allowUnreachableCode: false` | Unreachable code is an error |
| `verbatimModuleSyntax` / `isolatedModules` | Type-only imports are explicit, so the code is safe for per-file transpilers |

### Turning it on in a huge legacy repo **[Chief]**

You can't flip these flags on for the whole monorepo at once. Options:

1. **A tsconfig per owned folder.** `src/features/my-area/tsconfig.json` extends the repo config, adds the strict flags, and `include`s only that folder. Run `tsc -p src/features/my-area --noEmit` in the PR build. Imported files outside the folder are still checked with these options, so expect some noise from shared code. Fix it, or keep the folder's public surface small.
2. **Ratchet the error count.** Run `tsc --noEmit` with a strict flag on, count the errors per file, store them in a baseline, and fail when a file's count goes up. Some teams use tools such as `betterer` for this. The same approach as ESLint suppressions.
3. **Turn on `noUncheckedIndexedAccess` last.** It produces the most errors, and agents tend to "fix" them with `!`, which `@typescript-eslint/no-non-null-assertion` then catches.

`scripts/check-agent-gaming.mjs` fails any diff that sets a strict flag to `false` in a `tsconfig*.json`, and the Copilot hook denies agent edits to `tsconfig*.json` entirely.

## Discriminated unions instead of flag soup

```ts
type Load<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'failed'; error: Error };

function render(state: Load<User>): string {
  switch (state.status) {
    case 'idle':
      return '';
    case 'loading':
      return 'Loading…';
    case 'loaded':
      return state.data.name;
    case 'failed':
      return state.error.message;
  }
}
```

This replaces `{ isLoading: boolean; data?: T; error?: Error }`, which allows `isLoading: true` with an error *and* data at the same time.

- Enforce exhaustiveness with `@typescript-eslint/switch-exhaustiveness-check`. With `noImplicitReturns`, the compiler also complains if a case is missing.
- For non-switch code, use an `assertNever(x: never): never` helper.

## Branded types

```ts
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type TenantId = Brand<string, 'TenantId'>;
export type UserId = Brand<string, 'UserId'>;

export function isTenantId(raw: string): raw is TenantId {
  return /^[0-9a-f-]{36}$/i.test(raw);
}

export function parseTenantId(raw: string): TenantId {
  if (!isTenantId(raw)) throw new Error(`Invalid tenant id: ${raw}`);
  return raw;
}

declare function loadUser(tenant: TenantId, user: UserId): Promise<User>;
```

- `loadUser(userId, tenantId)` no longer compiles.
- The brand comes only from a type guard that actually checks the value. pstack's `typescript-best-practices` skill says: "A brand comes from a verifying type guard (`input is AgentId`), never from `as`." It also warns that "A lying guard is worse than `as`".
- For data that crosses a boundary (API responses, `localStorage`, `postMessage`), parse with a schema library such as zod or valibot rather than casting.

## Banning the escape hatches

In `examples/eslint.config.mjs`:

| Escape hatch | Rule |
|---|---|
| `any`, including `as any` | `@typescript-eslint/no-explicit-any` |
| `@ts-ignore`, `@ts-nocheck` | `@typescript-eslint/ban-ts-comment` (`'ts-ignore': true`, `'ts-nocheck': true`) |
| `@ts-expect-error` without a reason | `ban-ts-comment` with `'allow-with-description'` and `minimumDescriptionLength`. `check-agent-gaming.mjs` also fails new ones that have no `agent-exception`. |
| `as unknown as X` | `no-restricted-syntax` with selector `TSAsExpression > TSUnknownKeyword` |
| `{ ... } as Foo` object literal casts | `@typescript-eslint/consistent-type-assertions` with `objectLiteralTypeAssertions: 'never'` |
| `x!` | `@typescript-eslint/no-non-null-assertion` |
| Leaking `any` from untyped libraries | the `no-unsafe-*` rules in `strictTypeChecked` |

Want to go further? `consistent-type-assertions` with `assertionStyle: 'never'` bans `as` entirely. You then need an override block that turns it off for the boundary parsers (`**/parse*.ts`).

## Errors that name the fix

The `ban-ts-comment` message is fixed by typescript-eslint, so it can't name your fix. Put the guidance in the rule table in your instructions file, and in `check-agent-gaming.mjs`'s messages, which you control: "Fix the type error. Narrow with a type guard or parse at the boundary (e.g. a zod schema)."
