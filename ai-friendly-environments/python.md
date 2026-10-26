# Python

The same approach as [typescript-strictness.md](typescript-strictness.md), for a small new project: a FastAPI backend and a TypeScript frontend. poteto's rule is that there should be one conventional way to do each thing, so an agent copies the right path because it is the only path ([core principles](../poteto-advice/compilation/core-principles.md)). Minsky's line, as she summarised it, still applies: make illegal states unrepresentable, and types enforce that across the codebase ([26 Oct](https://x.com/poteto/status/2114626630429913383)).

The worked example is [examples/python](examples/python). From that directory, `uv sync` then `just check` runs Ruff, Pyright, import-linter and pytest. `just new-endpoint name=widget` is how a new endpoint is added.

## Strict typing

Types are the second level of the pyramid, as in the TypeScript guide. The agent gets the failure immediately, and the message should name the fix ([principles.md](principles.md)).

Pick one checker as the merge gate and run it in strict mode:

| Gate | What it demands |
|---|---|
| Pyright strict (`typeCheckingMode = "strict"`), the engine behind Pylance | Missing annotations, unknown types leaking out of untyped libraries, unused code |
| or `mypy --strict` | The same job, when the repo is already on mypy. One of these is the gate |

`examples/python/pyproject.toml` uses Pyright strict. Explicit `Any` is banned by Ruff `ANN401` (`any-type`): annotate with the real type, or parse at the boundary and return that type. A bare `# type: ignore` is banned by Ruff `PGH003` (`blanket-type-ignore`); an ignore has to name the rule code. `ANN` requires an annotation on every parameter and return value.

Two newer checkers, both written in Rust, are worth knowing and are not the gate. See the status section below.

- **ty** (Astral, the uv and Ruff team)
- **Pyrefly** (Meta)

### Boundaries

Pydantic is the schema library, and FastAPI already uses it. Every value that crosses a boundary is a Pydantic model: HTTP bodies, environment, and rows coming back from the database. Internal code then trusts those models. pstack's boundary rule is the same one as in the TypeScript guide: validate at the boundary, trust the types inside.

The example parses the path string with `parse_note_id` and parses the JSON response in the test with `Note.model_validate_json`. `response.json()` is typed as `Any` in the stubs, so the assertion compares the parsed model.

### Expressive types

Use the type that makes the wrong state unwritable.

| Need | Use |
|---|---|
| A closed set of states with no extra payload | `Literal[...]` |
| A closed set you also pass around as a value | `enum.Enum` |
| A state where some fields exist only in some cases | A discriminated union of frozen Pydantic models, exhausted with `match` and `assert_never` |
| An id that must not be confused with another id | `NewType` |
| A data shape | A frozen Pydantic model (`ConfigDict(frozen=True)`). Frozen dataclasses are the language feature for this; this project uses Pydantic so there is one shape tool |
| A behaviour another layer must provide | `typing.Protocol`, rather than duck typing or a base class |

```python
from typing import Literal, assert_never

from pydantic import BaseModel, ConfigDict


class Draft(BaseModel):
    model_config = ConfigDict(frozen=True)
    status: Literal["draft"]


class Published(BaseModel):
    model_config = ConfigDict(frozen=True)
    status: Literal["published"]
    published_at: str


NoteView = Draft | Published


def label(view: NoteView) -> str:
    match view:
        case Draft():
            return "draft"
        case Published():
            return "published"
        case _ as unreachable:
            assert_never(unreachable)
```

`load(note_id, user_id)` no longer compiles when the ids are different `NewType`s, which is the same win as the branded ids in [typescript-strictness.md](typescript-strictness.md). The brand still has to come from a function that checks the value. `parse_note_id` in `examples/python/src/app/models/notes.py` is that function.

### Tests

[tests.md](tests.md) applies. The Python choices:

| Job | Tool |
|---|---|
| Test runner | pytest. `unittest` is banned (`TID251`) |
| Property tests | Hypothesis, for parsers, reducers and anything with an invariant |
| Expect tests | `inline-snapshot` or syrupy. Print a small readable view and snapshot that, as Minsky describes, rather than a raw dump. Put the expected text in the test file so the PR diff shows the behaviour change |
| Coverage | Gate new lines only (diff-cover against the PR base). A whole-project percentage hides an untested new endpoint |
| Frontend types | Generate them from the FastAPI OpenAPI document, so a backend change fails the frontend build |

Generate types with `openapi-typescript` and call the API through one wrapper. Orval is the other generator, and it emits the client as well. Pick one before the first endpoint and delete the other. Two generated clients is two ways.

The example's `just check` does not run Hypothesis, inline-snapshot, syrupy or diff-cover. The endpoint test asserts the parsed `Note`. Add Hypothesis on the next pure function, and inline-snapshot when a response is worth reading in the diff. Until those are in `just check`, they are not yet a ban on the other kind of test.

### Async

The application is async throughout. Routes, services and repositories are `async def`. Ruff's `ASYNC` rules flag blocking calls inside them (`ASYNC210`, `ASYNC230`, `ASYNC240`, `ASYNC251` and the rest of that set). Tests drive the app with `httpx.AsyncClient` and `httpx.ASGITransport`, on anyio's asyncio backend (`anyio_mode = "auto"`). httpx is the HTTP client. Starlette's `TestClient` is typed against an `httpx2` import that is not installed here, so Pyright strict treats that client as unknown.

## Type checker status (26 October 2026)

The figures below are snapshots. The suite grows, and individual tests are edited in place, so a percentage from July is not the same measurement as one from October. The live series is the [typing conformance trend](https://driftcell.github.io/typing-conformance-trend/) dashboard. Its score is `(Pass + 0.5 × Partial) / total`.

### ty is still in beta

ty's beta was announced on 16 December 2025 ([Astral](https://astral.sh/blog/ty)). Astral uses it on their own projects. The post aimed at a stable release the following year. That release has not shipped. Current release: **0.0.92**, published 26 October 2026 ([release](https://github.com/astral-sh/ty/releases/tag/0.0.92)). 0.0.91 was 22 October 2026, which is the recent pace: a release every few days. 0.0.92 adds more Django model inference (`pk`, foreign-key ids, `get_<field>_display()`) and SARIF output (`ty check --output-format sarif`).

The project README states the version policy directly: ty uses `0.0.x` versioning, it has no stable API, and breaking changes, including changes to diagnostics, may occur between any two versions ([README](https://github.com/astral-sh/ty/blob/main/README.md)).

### Pyrefly is at 1.0, and diagnostics can still move

Pyrefly reached **1.0.0** on 12 May 2026 ([release](https://github.com/facebook/pyrefly/releases/tag/1.0.0), [blog](https://pyrefly.org/blog/v1.0/)). The blog quotes the semantic-versioning FAQ: if the software is already in production, it should probably be 1.0.0. It is the default checker for Instagram at Meta, about 20 million lines, and PyTorch and JAX had already adopted it. `pyrefly infer` writes annotations. Pydantic and Django support are built in ([comparison](https://pyrefly.org/en/docs/compare/)).

The current README is stricter about what 1.0 promises: Pyrefly does not follow strict semantic versioning, and any version may introduce new type errors ([README](https://github.com/facebook/pyrefly/blob/main/README.md)). `pyrefly suppress` exists to silence those on upgrade. An unconfigured run also uses the `basic` preset, which stays quiet on most type errors. `pyrefly init`, then `preset = "strict"`, is the setting that matches "strict" in this guide ([handbook](https://pydevtools.com/handbook/explanation/ty-vs-pyrefly.md)).

### Conformance is a moving target

Pyrefly's comparison page, citing the typing suite, reports pyright at 135.5/145 (93.4%), Pyrefly at 140.5/145 (96.9%) and mypy at 108.5/145 (74.8%) ([compare](https://pyrefly.org/en/docs/compare/)). Those percentages match the dashboard row for 13 August 2026 (pyright 1.1.410, Pyrefly 1.3.0-dev.1, mypy 2.1.0). Later rows have already moved.

The pydevtools handbook's ty-versus-Pyrefly page describes the July 2026 run, Pyrefly 1.1.0 against ty 0.0.50, as Pyrefly passing about 96% of cases outright and ty about 76%, with the rest scored partial rather than failing. It names ty's gaps then as generics (`TypeVarTuple`, constrained `TypeVar`), Protocols and type aliases ([handbook](https://pydevtools.com/handbook/explanation/ty-vs-pyrefly.md)). The dashboard's half-credit score on 18 June 2026 for those same versions is 97.9% and 82.3%. By 25 October 2026 the same dashboard has ty 0.0.91 at 95.9%. Re-check the dashboard before treating a July gap as a current one.

### Which checker an agent should fail on

Checker output that changes between versions is harmful for an agent. It cannot tell a new rule from a bug it introduced. Make **Pyright strict** the merge gate, and keep that version pinned. Add Pyrefly where its speed or its built-in Pydantic support pays for a second opinion, on a pinned version, and read a new failure as a possible checker change. Use ty as a fast editor and local check until it has a stable diagnostic API. Don't make a `0.0.x` checker the thing that decides whether the PR is green.

## One way to do everything

A paved road for each kind of change. The alternatives are banned by tools. A sentence in a doc that nothing runs is another option, and an agent will take it. This is principles §2 and §7 applied to a new Python service: architecture, then types, then lint whose message names the replacement, then a behaviour test, and prose last.

### One tool per job

Ruff `TID251` (`banned-api`) and import-linter. The message names the tool to use.

| Job | Use | Banned |
|---|---|---|
| HTTP | httpx | `requests`, `urllib`, `urllib.request`, `aiohttp` |
| Data shapes | Pydantic | `attr`, `attrs`, `collections.namedtuple`. A plain `dict` is not a boundary type |
| Logging | `app.log.get_logger` | `print` (`T201`), `logging.getLogger` outside `app/log.py` |
| Paths | `pathlib.Path` | `os.path` |
| SQL | The repository module, one query layer | `sqlite3`, `psycopg`, `psycopg2` from `app.api`, `app.services` and `app.models` (import-linter) |
| Time | Timezone-aware datetimes | Ruff `DTZ` (`DTZ001`–`DTZ007`, `DTZ901`) |

`logging.getLogger` is ignored only in `src/app/log.py`. The generator script may `print` the paths it wrote (`T201` ignored only in `scripts/new_endpoint.py`), because that stdout is the list of files the agent should open.

### Fixed architecture

Imports point one way: `app.api` → `app.services` → `app.repositories` → `app.models`. import-linter's layers contract rejects an upward import. A second contract rejects a direct import from `app.api` to `app.repositories` (`allow_indirect_imports = true`, so the chain through the service is legal). Models are the shared bottom: the route's return type is a model. The route does not construct a repository. `default_note_service()` in the service module does.

One file per feature, the same name in each layer (`notes.py`). `create_app` loads every `app.api` module that exports `router`. There is no second registration list to forget.

Agents add an endpoint with the generator, not by copying files by hand:

```sh
just new-endpoint name=widget
```

`scripts/new_endpoint.py` writes the model, repository, service, router, pytest module and a TypeScript client from `scripts/templates/`. It refuses to overwrite. The client is a typed `fetch` wrapper with a type guard. When you adopt `openapi-typescript`, change that template to import the generated types and delete any hand-written duplicate in the same change.

### Language features that open a second path

| Banned | Enforced by |
|---|---|
| `exec` / `eval` | Ruff `S102`, `S307` |
| Bare `except` and `except Exception` | Ruff `E722`, `BLE001`. Catch the operation's own exception |
| `global` | Ruff `PLW0603` |
| Mutable default arguments | Ruff `B006` |
| Relative imports, including deep ones | Ruff `TID252` with `ban-relative-imports = "all"` |
| Commented-out code | Ruff `ERA001` |
| Sync calls inside the async stack | Ruff `ASYNC` |
| `Any`, bare `# type: ignore` | Ruff `ANN401`, `PGH003` |

Errors are typed exceptions colocated with the operation (`NoteNotFoundError` lives next to `NoteService`). The route maps that exception to an HTTP status. A `Result` type would also work. This project uses the exception. Don't add a `Result` beside it.

Inheritance has three allowed bases: `pydantic.BaseModel`, `typing.Protocol`, and `Exception` for that colocated error. `Enum` is the other allowed base, and only for a closed set of values. Metaclasses, `__getattr__` and assigning over another module's attributes are not a Ruff rule yet. The import of `unittest.mock` is banned. pytest's `monkeypatch` fixture is not, so it is a trait until a rule exists. A star import (`from x import *`) is not a single Ruff code either. Don't describe these as bans until `just check` fails on them.

### Formatting and names

`ruff format` with its defaults (88 columns, double quotes). `E501` is off because the formatter does not wrap long strings, and two line-length rules make the agent fix one and break the other. Ruff `N` covers names, including `N999` for module names. The generator only accepts `snake_case`, so the filenames it writes already match.

### One way to test

pytest only. One `conftest.py` per layer once there is more than one test module; the example has a single `tests/conftest.py` because there is one layer of tests. The fixture is an `httpx.AsyncClient`. Every endpoint the generator writes ships with a test that calls the route and parses the body.

`scripts/check-agent-gaming.mjs` now flags, on any added `.py` line, `pytest.mark.skip`, `pytest.mark.skipif`, `pytest.mark.xfail`, `pytest.skip(` and `pytest.xfail(`. The same `agent-exception` escape hatch as the TypeScript rules applies. The test is in `scripts/check-agent-gaming.test.mjs`.

Deleting a `test_*.py` file is not yet matched by that script. Its test-file pattern is the TypeScript one (`*.test.ts`, `*.spec.ts`, `__tests__/`). Extending it to `test_*.py` / `*_test.py` is the follow-up. Until then, a deleted Python test file is not caught.

### One command

uv is the installer and the runner. There is one `pyproject.toml` and the `uv.lock` it resolves. pip, Poetry and `requirements.txt` are not a second path; don't add the files.

```sh
just check
```

That is Ruff (`ruff check`, `ruff format --check`), Pyright, `lint-imports` and pytest. Green means the mechanical rules hold. It does not mean a trait was reviewed.

### Traits

Some rules are judgement, and no checker sees them. They stay in a short list, and a decision model on the PR is what checks them. Two to start with:

| Trait | What "wrong" looks like |
|---|---|
| Services return domain objects | A service returns an ORM row, a cursor, or a `dict` |
| Names follow the feature | A module, type or route named for the mechanism (`utils`, `helpers`, `manager`) rather than the feature (`notes`) |

This is the bottom of the pyramid, used as little as possible. The `/correct` loop ([copilot-skills/correct/SKILL.md](copilot-skills/correct/SKILL.md)): every time an agent takes a second path, add a lint rule or a trait in the same change. If the rule was already in this list and nothing enforced it, that is a repeat, so move it up the pyramid. Drop a row once the mistake can no longer be written.

### Warnings

An unenforced rule is another option. If CI does not fail, delete the sentence or build the check before calling it a ban. The rows above that say "not a Ruff rule yet" are in that state on purpose.

On a codebase that already exists, ratchet. Turn the rule on, baseline the current violations, and fail only on new ones, as in [lint-rules.md](lint-rules.md). This example is a new project, so the rules are on for every file and there is no baseline.

## What was run

From `examples/python`, with uv 0.13.5 and Python 3.12:

| Command | Result |
|---|---|
| `uv sync` | Installed the lockfile. FastAPI 0.162.0, Pydantic 2.14.1, httpx 0.28.1, Ruff 0.17.2, Pyright 1.1.414, import-linter 2.15, pytest 9.1.1 |
| `ruff check` | Passed |
| `ruff format --check` | Passed |
| `pyright` | Passed, 0 errors |
| `lint-imports` | Three contracts kept |
| `pytest` | 5 passed |
| `just check` | The five commands above, passed |
| `just new-endpoint name=widget` | Wrote the six files. A second `just check` passed (7 tests). Those files were removed so the sample stays the one `notes` endpoint |
| `node --test scripts/check-agent-gaming.test.mjs` | Passed, including the pytest skip/xfail case |

ty, Pyrefly, Hypothesis, inline-snapshot, syrupy and diff-cover were not part of that run.
