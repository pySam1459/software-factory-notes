# pstack: plugin vs copied skills (28 Oct 2026)

- Question: [Melkey (@MelkeyDev)](https://x.com/MelkeyDev/status/2115473982204018744), 28 Oct 2026
- Answer: [poteto](https://x.com/poteto/status/2115500996659122327)
- Follow-up: [Melkey](https://x.com/MelkeyDev/status/2115502058371682809)
- Related: [Theo's tstack skills](2026-10-26-theo-tstack-skills.md)

## The question
Melkey asks poteto why pstack ships as a plugin rather than copyable skills, the way Theo's tstack does:

> Hey @poteto question regarding pstack - was there a decision to go with a plugin installation design vs just copying skills (like Theo and tstack)? Have you seen any specific advantages?

tstack's install is a straight copy: `cp -R skills/*` into `~/.claude/skills/` or `~/.codex/skills/`. pstack is installed as a Cursor plugin (`/add-plugin pstack`).

## poteto's answer
> it's easier to distribute and keep updated, and they're meant to be composed together rather than be used piecemeal (although they can)

Two reasons:

- **Distribute and update.** A plugin is one install that can be updated in place. A copied skill folder only changes when someone copies it again.
- **Composition.** The skills are a set that is meant to be used together. Piecemeal use is allowed ("although they can"), not the design. `/poteto-mode` is the entry point that pulls the other skills in as a task needs them.

Melkey's follow-up: plugin distribution depends on the harness. On some of them each user has to turn on auto-update. poteto did not reply to that in the thread.

## Other replies on the thread
Not poteto, but they are the rest of the answers under the question:

- Updates are the common guess (auto-update, "keeping stuff up to date").
- One person ships org Claude skills as a plugin for the same reason: easier to distribute updates, and they only use Claude.
- Symlink the skills out of a cloned repo and pull on a schedule, instead of either a plugin or a one-time copy (a fork of tstack is linked from that reply).
- Copy them in with the agent and merge upstream changes yourself after editing.
- A tool that vendors a plugin into the project.
- Running pstack and tstack together.
- One reply calls the plugin "gatekeeping for cursor"; another points at Superpowers, which ships on Cursor, Claude and Codex, as a counterexample.

## Takeaways for us
- Same shape as tstack: a thin skill that composes the others, with a single skill still invocable on its own. poteto is explicit that composition is why they are packaged together.
- Plugin vs copy is a distribution choice, not a difference in what a skill is. poteto wants updates to arrive without a re-copy. A copy or a symlink is how you keep a local fork, which is what tstack's install assumes.
- Melkey's caveat matches a real constraint: auto-update is per harness, and sometimes per user. "Easier to update" holds where the plugin host actually updates.
