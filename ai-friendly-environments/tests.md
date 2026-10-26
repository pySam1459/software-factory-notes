# Tests that agents can't game

Tests sit at the static analysis level of the pyramid, but agents have two habits that undermine them:

- they write weak tests ("unit tests are great! unfortunately agents don't seem to write good ones": poteto, [4 Oct](https://x.com/poteto/status/2106887304455540896))
- they make a failing test go away rather than fixing the code

pstack's "Test Behavior, Not Implementation" principle: assert "what the code's users can observe, so a test fails when that behavior breaks and survives a change to the internals". `/correct`: "Fix or delete any test that still passes when the behavior it checks breaks, or that fails when only the internals change."

## Expect tests (Minsky)

Ron Minsky's talk ([YouTube](https://www.youtube.com/watch?v=rUYP4C29yCw), transcript in `../poteto-advice/raw/transcripts/`) makes the case for **expect tests**: "you have these tests where you print stuff out and then you can capture" the output in the test file itself.

- They are "at their best a tool for driving human understanding of the program under study".
- On agents: "expect tests let you see the behavior … of the system and they let you see changes to that behavior and the same is true of the agents … expect tests are just another kind of loop closing."
- He stresses that the printed output must be designed to be readable: "If you … dump a ton of output that's really hard for a human to look at, … you will have achieved nothing."

poteto's summary ([26 Oct](https://x.com/poteto/status/2114626630429913383)): "expect tests: just print stuff out and capture it in the test. makes behavior legible. it's very similar to how compilers have fixture tests, it reduces the review surface area". She points to the React compiler's fixtures as an example ([reply](https://x.com/poteto/status/2114630175040348590)): <https://github.com/react/react/tree/main/compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler>.

The review benefit is that when an agent changes behaviour, the PR diff shows the before and after output. You review the behaviour, not the code.

### In TypeScript: inline snapshots **[Chief]**

Vitest (or Jest) inline snapshots are the closest equivalent:

```ts
import { describe, it, expect } from 'vitest';
import { summariseThread } from './summariseThread';

function show(s: ReturnType<typeof summariseThread>): string {
  return [
    `title: ${s.title}`,
    `participants: ${s.participants.join(', ')}`,
    `unread: ${s.unread}`,
    ...s.badges.map((b) => `badge: ${b}`),
  ].join('\n');
}

describe('summariseThread', () => {
  it('marks a thread with an unread mention', () => {
    const s = summariseThread(fixtures.threadWithMention);
    expect(show(s)).toMatchInlineSnapshot(`
      "title: Release planning
      participants: Ana, Sam
      unread: 3
      badge: mention"
    `);
  });
});
```

- **Write a small `show()` printer** rather than snapshotting raw objects. That follows Minsky's point about readable output, and it keeps snapshots stable when unrelated fields change.
- **Use `toMatchInlineSnapshot`** so the expected output sits next to the input. Avoid separate `.snap` files: reviewers don't open them.
- **For UI:** render with Testing Library and print the accessible structure (role, name, state) rather than the DOM HTML.
- **Updating snapshots** (`vitest -u`) is how an agent can "fix" any test. That's why the Copilot hook denies `-u`. An agent should change a snapshot only by editing it, so the change is visible in the diff with a reason.
- **Generate fixture tables** for pure functions (parsers, reducers, formatters). One input file plus one expected-output section per case, the way the React compiler does it.

### Property tests, fuzzing and simulation

From Minsky's talk, as summarised by poteto: "property based tests, fuzzing, and even full-system deterministic simulation testing". In TypeScript, `fast-check` covers property tests (`fc.assert(fc.property(...))`). Reducers and state machines are the best targets, because you can generate random action sequences and check invariants after each step. **[Chief]**

## Determinism: fake time and network **[Chief]**

Flaky tests teach agents that failures can be retried away. Remove the sources of non-determinism.

```ts
import { beforeAll, afterAll, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.example.invalid/threads/:id', ({ params }) =>
    HttpResponse.json({ id: params.id, title: 'Release planning' }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
  vi.setSystemTime(new Date('2026-10-26T09:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

it('shows "just now" for a message sent this minute', async () => {
  const view = await loadThread('t1');
  await vi.advanceTimersByTimeAsync(30_000);
  expect(view.lastActivityLabel()).toBe('just now');
});
```

- `onUnhandledRequest: 'error'` means a test that reaches the real network fails.
- Fix the clock with `vi.setSystemTime`. Advance it explicitly, rather than with `sleep`. Fake only timers and `Date` (`toFake`), so promise and microtask scheduling stays real and MSW still resolves.
- Seed randomness: inject a random source, or seed `fast-check`.
- Set the time zone in the test script (`TZ=UTC vitest`), so tests behave the same on Sam's Windows machine and on the Linux agent.

## Catching gamed tests

Agents make a red build green in these ways, and here is what catches each one in this repo:

| Gaming move | Caught by |
|---|---|
| Deleting a test file or snapshot | `check-agent-gaming.mjs`: deleted test/snapshot file |
| Deleting test cases inside a file | `check-agent-gaming.mjs`: net removal of `it`/`test` calls |
| `.skip`, `.only`, `xit`, `fit` | `check-agent-gaming.mjs`, `vitest/no-focused-tests` / `no-disabled-tests`, and `vitest run --allowOnly=false` in CI |
| Renaming `foo.test.ts` so the runner ignores it | `check-agent-gaming.mjs`: test renamed to a non-test name |
| Bulk `-u` snapshot updates | Copilot `preToolUse` guard denies `vitest -u` / `jest -u` |
| Asserting nothing | `vitest/expect-expect` |
| Assertions inside an `if`/`catch` that never runs | `vitest/no-conditional-expect` |
| Loosening `tsconfig` to make types pass | `check-agent-gaming.mjs` and the hook (protected file) |
| Mocking the unit under test | Review, or a `no-restricted-syntax` rule banning `vi.mock` of paths inside the same feature folder |

Two more checks worth adding later:

- **Mutation testing** (Stryker) on owned folders, run nightly. Surviving mutants show tests that "still pass when the behavior breaks".
- **Coverage must not drop** on changed files.
