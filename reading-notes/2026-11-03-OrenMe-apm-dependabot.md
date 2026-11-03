# Dependabot adds APM version updates (@OrenMe)

Source: [@OrenMe on X, 3 Nov 2026 22:04 UTC](https://x.com/OrenMe/status/2117739760017948898) (GitHub Star, Microsoft MVP, AI Transformation at AT&T). 1 reply. Linked changelog: [Dependabot version updates support Agent Package Manager](https://github.blog/changelog/2026-11-03-dependabot-version-updates-support-agent-package-manager/) (3 Nov 2026).

## The argument

Agentic primitives (skills, agents, MCPs, instructions and related files) are becoming supply-chain dependencies. They need the same operational stack as software packages: versioning, dependency resolution, lockfiles, automated updates, provenance and CI enforcement. Dependabot first-class support for APM is a small changelog and a big signal that the ecosystem is catching up.

He claims three prior steps in the same direction: JFrog added APM support; Renovate added APM dependency resolution; GitHub Agentic Workflows already uses APM for dependency management. Now Dependabot can keep APM dependencies up to date.

## What APM is

[Agent Package Manager](https://github.com/microsoft/apm) (`microsoft/apm`) is Microsoft's open-source dependency manager for AI agent context. Docs: [What is APM?](https://microsoft.github.io/apm/concepts/what-is-apm/).

- Manifest: `apm.yml` lists `dependencies.apm` (skills, prompts, agents, plugins, full packages) and `dependencies.mcp` (MCP servers).
- Lockfile: `apm.lock.yaml` pins resolved sources to exact commits and content hashes. Commit both; gitignore `apm_modules/`.
- Install: `apm install` resolves the tree (including transitive deps) and writes harness-native files. For Copilot that means under `.github/` (instructions, skills, agents, prompts, hooks) plus neutral paths such as `.agents/` where applicable. It does not invent a runtime; it writes files each harness already reads.
- Also: Unicode scan on install, optional `apm-policy.yml` governance, `apm audit` / `apm audit --ci`, `apm install --frozen` for CI.

## What Dependabot now does

From the [changelog](https://github.blog/changelog/2026-11-03-dependabot-version-updates-support-agent-package-manager/) and [supported ecosystems](https://docs.github.com/en/code-security/reference/supply-chain-security/supported-ecosystems-and-repositories):

- `package-ecosystem: "apm"` in `.github/dependabot.yml`, with `directory` pointing at the folder that holds `apm.yml`.
- Opens version-update PRs for supported **git** deps under `dependencies.apm` and `devDependencies.apm`.
- Regenerates `apm.lock.yaml` when present (runs `apm lock`). Does not create a lockfile if none exists.
- **Version updates only**, not security updates (changelog). GA on github.com; GHES 3.24 later.
- Pin behaviour: SemVer tags bump to latest SemVer tag; commit SHAs move to the latest annotated non-prerelease release tag (tag left as a comment); branch pins update the lockfile only (manifest still names the branch) and need an existing lockfile.
- Not updated: object-form entries, `mcp:` entries, unpinned refs, local paths, Azure DevOps hosts, some quoting forms, abbreviated SHAs. Private git registries via Dependabot git registry config.

Minimal shape:

```yaml
version: 2
updates:
  - package-ecosystem: "apm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Claims check

| Claim | Verdict | Primary source |
|---|---|---|
| Dependabot first-level APM support | **Checks out** | Changelog + docs (`package-ecosystem: "apm"`) |
| JFrog added APM support | **Checks out** (Agent Packages repos; beta; APM 0.23.0+) | [JFrog Agent Packages Repositories](https://docs.jfrog.com/artifactory/docs/agent-packages-repositories); [jf agent apm](https://docs.jfrog.com/artifactory/docs/jf-agent-apm) |
| Renovate added APM dependency resolution | **Checks out** | [Renovate APM manager](https://docs.renovatebot.com/modules/manager/apm/) (updates tagged pins in `apm.yml`, refreshes `apm.lock.yaml` via `apm install`) |
| GitHub Agentic Workflows already uses APM | **Checks out**, with nuance | [gh-aw APM Dependencies](https://github.github.com/gh-aw/reference/dependencies/): import `shared/apm.md` and pass `packages:`; dedicated `apm` job packs via `microsoft/apm-action`. Older top-level `dependencies` / `imports.apm-packages` forms are deprecated or removed. |

Unverified: whether AT&T's factory already runs Dependabot on `apm.yml`; depth of JFrog's security scanning for agent packages (blog mentions work in progress).

## Reply

@HarryTandy: "lockfiles for agent behavior is a wild thing to picture, but it tracks." No vendor plug; agrees with the framing.

## GHCP mapping for Sam's factory

Treat custom agents, skills, instructions and shared MCP configs as **versioned APM dependencies**, not a loose `.github/` tree:

1. Add root `apm.yml` + commit `apm.lock.yaml`. Target `copilot`. Pin shared packages (and any internal skill/agent packages) to SemVer tags or SHA+tag comments. Prefer git pins Dependabot can bump.
2. Enable Dependabot: `package-ecosystem: "apm"` in `.github/dependabot.yml`. Review those PRs like npm bumps. For MCP servers, Dependabot will not bump `mcp:` entries; manage those separately (registry pins / org allowlists).
3. **CI on primitive bumps:** required check that runs `apm install --frozen` (or `apm audit --ci`) and a fixed eval pack of past factory tasks before merge. A green Dependabot PR that only regenerates the lockfile is not enough if agent behaviour changed.
4. Tie bumps to the prune / measure loop from the Treude/Baltes `/retro` study: [../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md](../ai-friendly-environments/2026-11-03-mattpocockuk-retro-skill-paper.md). Tag which evals each package is meant to affect so a bump can be ablated or reverted.
5. Personal modes from the `/automate-me` pattern ([../poteto-advice/2026-11-03-_nogu66-pstack-automate-me.md](../poteto-advice/2026-11-03-_nogu66-pstack-automate-me.md)) should land as reviewed packages or pinned local packages under APM, not silent edits to standing instructions.
6. For Agentic Workflows, use `imports: - uses: shared/apm.md` with pinned `packages:` so runtime context matches the lockfile story. Keep host-repo and imported primitives intentional (isolated vs merge; see APM/gh-aw docs).
7. Provenance: commit lockfile hashes; consider org `apm-policy.yml` allow-lists; private packages via JFrog Agent Packages or private git + Dependabot git registries when the factory needs a trusted registry.

**Takeaway:** Dependabot on APM makes agent context look like a normal dependency. Sam still needs human review plus eval gates so a skill bump cannot silently change factory behaviour.
