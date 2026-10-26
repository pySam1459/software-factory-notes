# Traits (trait-driven development)

## The idea

Harry Solovay, "Trait-driven development" ([post](https://x.com/harrysolovay/status/2114760577377821007)):

> I'm no longer really operating directly on code. Instead, I create traits which operate on the code + ensure agents never need the same feedback twice.

He links to [traits.sh](https://traits.sh/), which describes a trait as "a reusable preference your agent learns from your feedback. It describes what matters to you and gives future work context that takes judgment to apply."

The shift is to stop fixing the code each time and fix the rules that produce the code. A review comment you would otherwise repeat gets written down once, as a small file in the repo, and every later agent reads it.

## Anatomy of a trait

One file per trait, at `.agents/traits/<name>.md`. The frontmatter has four fields, and the body holds any extra context, usually a before/after diff.

| Field | traits.sh's description |
|---|---|
| `name` | "A minimal name with which to reference this trait from chat." |
| `subject` | "What to look at. Identifies the thing being assessed." |
| `requirement` | "What should be true about the subject. The authoritative criterion." |
| `purpose` | "The reason behind it. What the preference aims to protect." |
| body | "Any additional context with which the agent should interpret the current trait." |

Their own example, `.agents/traits/colocate-small-domain-errors.md`, started from the feedback "Keep small errors beside the operations that produce them, unless ownership or dependencies justify separating them":

```markdown
---
name: colocate-small-domain-errors
subject: Small domain-specific error types.
requirement: Define small domain-specific error types alongside the domain operations that produce them rather than creating standalone error modules, unless separate ownership or dependency constraints justify a separate module.
purpose: Keep small error definitions close to their meaning and avoid unnecessary module fragmentation.
---
```

The "unless ownership or dependencies justify it" clause is the point. A lint rule can't express that, but a model reading the diff can weigh it.

## The loop

1. You correct the agent in chat ("use the union's case guard here, rather than comparing the tag yourself").
2. The agent asks which insights from that feedback to keep as traits.
3. You approve. The approved traits become context for future work.
4. "Decision models check subsequent code generation against all your traits, flagging ignored traits and nuances for the agent to fix."

Traits aren't fixed laws. traits.sh: "You can clarify a trait when the wording is too broad and reconcile it when a new preference conflicts."

## The two MCP tools

traits.sh ships as an MCP server with two tools.

- **`derive_trait`** compares a proposed trait with your collection. A distinct trait can be saved, and an existing one can be reused or clarified. Confirmed conflicts need an explicit reconciliation approval. Every creation or change needs your approval.
- **`check_traits`** takes files or glob patterns, reviews their current contents in 200-line chunks against the selected traits, and returns the assessments that need attention. Pass `traitNames` for a focused review. Overlapping matches are deduplicated, and patterns that match nothing review nothing.

## Traits vs lint rules and types **[Chief]**

So the "checker" is a model, and a model's verdict is a judgement call, not a guarantee. That puts traits on the **prose** level of the inverse pyramid ([principles.md](principles.md)). They're better prose than a giant `AGENTS.md` because they're small, named, scoped by `subject` and actively checked, but they're still prose.

| The rule is... | Put it in |
|---|---|
| Impossible to write if you change the structure | Architecture |
| Rejectable by the type checker (pyright / tsc) | Types |
| Detectable from syntax or imports | Lint rule (Ruff / ESLint), with an error message that names the fix |
| A judgement call: "unless", "prefer", naming after the domain, where code belongs, what a module is for | **Trait** |

A trait can also be a stepping stone. Write it as a trait first, and if `check_traits` keeps flagging the same mechanical pattern, promote it to a lint rule and delete the trait.

## How it fits `/correct` **[Chief]**

[`/correct`](copilot-skills/correct/SKILL.md) and traits both turn repeated corrections into durable rules. `/correct` step 2 already says "Instructions last, only for judgement calls". Traits can be the format for that last level: when `/correct` decides a class of mistake can't be enforced by architecture, types or lint, it writes `.agents/traits/<name>.md` instead of a line in an instructions file. The rule table then reads `rule | enforced by: trait <name> | added`.

## An in-house setup at Microsoft **[Chief]**

The trait files are plain Markdown, so the format needs no tooling. The parts are:

1. `.agents/traits/*.md` in the repo, reviewed in PRs like code.
2. A pointer in `.github/copilot-instructions.md` (or `AGENTS.md`): "Before writing code, read the traits in `.agents/traits/` whose `subject` matches what you're changing."
3. A read-only review skill, [copilot-skills/check-traits/SKILL.md](copilot-skills/check-traits/SKILL.md), that checks the current diff against the traits and reports findings.
4. The same check on each PR in CI, run by Microsoft's internal decision model instead of a third-party service. It should post findings as PR comments, not fail the build, since the verdicts are judgement calls.

Before using the hosted traits.sh MCP server on work code, check where its decision model runs and where your code is sent. The site doesn't say.

## Starting on the new Python + TypeScript project **[Chief]**

A small, young codebase is the best place for this, because you set the rules before patterns spread.

1. Put the hard rules in place first: pyright strict and Ruff for the Python backend, and strict tsconfig plus the ESLint config in [examples/](examples/) for the frontend. Anything those tools can catch shouldn't become a trait.
2. Create `.agents/traits/` with nothing in it. Add a trait only when you've given the same feedback twice, which is the same threshold `/correct` uses.
3. Start with the examples in [examples/traits/](examples/traits/) only if they match how you actually want to work. Copy them, don't link them.
4. Prune every month or so. Delete traits that never fire, merge ones that overlap, and promote mechanical ones to lint rules.

## Caveats

- The checking is done by a model, so expect false positives and misses.
- Each trait adds context the agent has to read. Keep them short and scoped, following the same hygiene as [agent-config-hygiene.md](agent-config-hygiene.md).
- The traits.sh notes here come from its landing page (read 26 Oct 2026). Harry's post is quoted from the text Sam shared, not fetched directly.
- The `check-traits` skill and CI setup are untested drafts.

## Sources

- Harry Solovay, "Trait-driven development": https://x.com/harrysolovay/status/2114760577377821007
- traits.sh: https://traits.sh/
