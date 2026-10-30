# Lean 4 derived C for the $12 server

Harsh Gupta (GitHub `hargup`, X [@hargup13](https://x.com/hargup13)) submitted a Lean 4 specification that generates the C application layer for Arjay McCandless's [$12 server challenge](https://www.arjaythedev.com/12-dollar-server): a SQLite-backed feed API on one vCPU and 2 GB of RAM. The submission sits at [submissions/lean-derive-hargup](https://github.com/arjaythedev/twelve-dollar-server-challenge/tree/main/submissions/lean-derive-hargup), arrived as [PR #153](https://github.com/arjaythedev/twelve-dollar-server-challenge/pull/153) ("Lean 4 derived C-Code"), and is [number one on the official leaderboard](https://benchmarks.arjaythedev.com/12-dollar-server/leaderboard/lean-derive-hargup) at 280,000 concurrent users. Arjay covered it in the YouTube Short [Lean vs $12 server?!](https://www.youtube.com/shorts/Cr69N5pG258) (uploaded 30 Oct 2026, Europe/London). A TikTok mirror was not confirmed. The challenge database is SQLite, not MySQL.

## What is specified

`spec/` is a Lean 4.35.0 package with no dependencies beyond Lean's core library. The pieces map cleanly onto generated C in `gen/app_gen.c`:

| Lean file | Role |
|---|---|
| `Model.lean` | Users, posts, likes as lists in rowid order; `feed`, `getPost`, `newPost`, `like` as plain functions. Source of truth and test oracle. |
| `Invariant.lean` | `Db.Inv`: dense post ids `1…n`, monotonic `created_at` in rowid order, every author exists. Startup `checkInv` and post-insert `insertOk`. |
| `Plan.lean` | `feedPlan` and `postPlan` over B-tree primitives (tail scan, rowid seek, one likes-index range scan), with equality proofs against the model. |
| `Contract.lean` | Routes, status lines, error messages, JSON shapes, body limit (500 chars), feed page size (20). |
| `Schema.lean` | `schema.sql` as data; field positions and a startup `PRAGMA table_info` check. |
| `Emit.lean` | Generator that fills a C template into `app_gen.c`. |
| `Main.lean` | `lake exe derive <dir>` writes `app_gen.c`. |

`build.sh` regenerates `app_gen.c` and refuses to build if it differs from the checked-in copy. Lean's kernel checks the theorems on every build. There is no `sorry`; only the standard axioms.

## What is proved

From `Invariant.lean` and `Plan.lean`:

- `checkInv_sound`: a true startup scan implies `Inv`.
- `inv_addPost`: a true `insertOk` after insert preserves `Inv`.
- `inv_like`: likes never touch posts or users, so they preserve `Inv`.
- `feed_eq_tail`: under `Inv`, `feed` equals the last 20 posts by rowid, newest first (because dense + mono make feed order reverse rowid order).
- `feedPlan_eq`: under `Inv`, the generated feed plan equals `feed`.
- `postPlan_eq`: `postPlan id = getPost id` with no invariant needed.

If the layout, the invariant check, or another connection's write fails, the server falls back to the specification's SQL for good. The plans are proved against the model; the emitted C for those plans is tested (byte-identical feed and 20,000 random posts vs SQL on the seed), not proved.

## How C is emitted

`Emit.lean` specialises fixed algorithmic skeletons: serializers with constant JSON bytes merged, every error response as complete constant bytes with `Content-Length` computed in Lean, route matching and check order, schema field positions, SQL text for writes and the fallback feed, the invariant checks, and the feed window. The runtime under `runtime/` is hand-written and application-independent: io_uring transport, HTTP framing, JSON input, HS256 JWT, output buffers, and SQLite B-tree cursor helpers. One binary, no nginx, HTTP/1.1 keep-alive on `:80`.

## SQLite B-tree bypass

Reads call SQLite's own B-tree API (`sqlite3BtreeTableMoveto`, `sqlite3BtreeIndexMoveto`, Next/Previous, payload fetch) inside a SQLite transaction, through the pager, WAL and locking. What is skipped is the bytecode interpreter, because each query is known ahead of time. Writes stay as ordinary prepared SQL. Under `Inv`, the feed is: last 20 rows of the posts table B-tree, plus one range scan of `likes_post_id_idx` for all twenty like counts. The reference plan walks the `created_at` index, seeks each row, and counts likes per post. Measured on the seed with identical JSON: feed 16.7 µs with SQL versus 5.4 µs with the native plan.

The invariant is what makes the shortcut safe. Without dense ids and monotonic timestamps, reverse rowid would not be feed order. The server checks `Inv` once at startup and after every insert, and watches SQLite's data version so a foreign writer forces the SQL fallback.

## Results

Official benchmark on the Synteq 1 vCPU / 2 GB box (from the PR discussion): 280,000 users held for five minutes, 26,683 req/s, p95 141 ms / p99 316 ms, 0 errors, 92% app CPU, 836 MB peak. That put it ahead of the previous Rust and F# leaders. Local same-harness comparisons on a faster Xeon (not the official score) reported about 19 µs CPU per request versus about 24 µs for the Rust io_uring entry.

## Takeaways for a GHCP / pstack factory

- **Specs before code.** A Lean (or similar) domain model plus contract is a stronger skill artefact than a prompt. Custom agents and instructions can require a small, checkable spec for hot paths before the coding agent is allowed to emit implementation.
- **Proofs as ungammable gates.** CI Actions (or Agentic Workflows) that run `lake build` / kernel checks are a hard gate agents cannot talk their way through. Treat a green proof job the way you treat a required review.
- **Narrow the search.** Once `Inv` and the contract pin the plan, there is little room for the agent to invent a different feed algorithm. That matches poteto's push toward sharp skills over open-ended chat.
- **Generate the specialised layer.** The interesting move is not "prove an existing C server" but "prove the plan, then emit the C." A coding agent plus an emit skill could own that pipeline; humans own the model and the theorems.
- **Keep a safe fallback.** When the invariant fails, fall back to the boring path. Automations can watch for that switch and open a review rather than silently staying on the fast path.
- **Trust boundary stays wide.** The Lean theorems do not cover the emitter's C text, the hand-written runtime, SQLite itself, the kernel, or io_uring. Tests still carry those. Formal verification here is a sharp knife on the domain plan, not a blanket over the whole stack.

For Microsoft Copilot work on a Python backend and TypeScript frontend, the same pattern applies without Lean on day one: write down invariants the coding agent must preserve, put mechanical checks in Actions, and only then let agents specialise hot paths. Lean (or another prover) is the endgame when the check has to be a proof.
