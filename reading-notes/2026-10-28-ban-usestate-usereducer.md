# Ban useState, use useReducer

- Source: https://x.com/hot_town/status/2115458417456558218 (28 Oct 2026), quoting Matt Pocock: https://x.com/mattpocockuk/status/2115442777647726835 ("Debating just straight-up banning useState in my React apps. Push the agent into the black hole of success")
- Note: based on post text; the attached 52s video was not reviewed.

## Takeaway
- Same family as banning `useEffect`: remove a flexible primitive so agents take the one obvious path.
- A reducer makes every state change an explicit, typed action, so logic lives in one place instead of scattered `setX` calls; fits "a single possible implementation path".
- Enforce with ESLint `no-restricted-imports` / `no-restricted-syntax`.
- Cost: boilerplate for trivial toggles, which agents don't mind.
