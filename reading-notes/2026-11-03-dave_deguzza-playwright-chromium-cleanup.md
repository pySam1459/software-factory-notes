# @dave_deguzza: don't delete Playwright; clean old Chromium caches and point MCP at Chrome

Source: [@dave_deguzza on X, 3 Nov 2026, 10:15 UTC](https://x.com/dave_deguzza/status/2117561292936606163). Bio: builds tiny start-ups and reviews SaaS/AI tools. Treat as a tip, not authority. Full text recovered via the X API `note_tweet` field (timeline text truncates mid-sentence). Metrics at fetch: about 30 likes, 74 bookmarks, 4 replies, ~2k impressions.

## The claim

Do not uninstall Playwright. Instead paste a prompt into Claude Code that (1) finds every Playwright/Puppeteer browser cache on the machine and deletes Chromium builds older than **156.0.8078.73**, (2) edits the Playwright MCP config to add `--browser chrome --sandbox` so MCP uses auto-updated system Chrome, and (3) greps Electron apps under AppData for Chrome/Electron version strings below **43.8.6 / 44.10.1 / 45.2.1**. He says it took 10 minutes and found three vulnerable Chromiums, a dead Puppeteer cache, and an EOL Electron in Cursor.

## Why 156.0.8078.73

That build is real. Google's [Chrome Releases Stable update, 27 Oct 2026](https://chromereleases.googleblog.com/2026/10/stable-channel-update-for-desktop_0562499947.html) shipped **156.0.8078.73/.74** (Windows/Mac) and **.73** (Linux) with **52 security fixes**, including four Critical CVEs (among them CVE-2026-118306 memory corruption in FileSystem, described elsewhere as potential code execution outside the sandbox via a crafted page). Secondary write-ups say it was superseded by **156.0.8078.79** on 29 Oct. So the version floor in the prompt is a reasonable "at least this Stable security train" marker for Chromium-family browsers, not a Playwright invention.

Bundled Playwright/Puppeteer Chromiums sit outside Chrome's auto-update path, so they can lag the Stable floor after a big security push. That part of the tip checks out as a motive. The author's "3 vulnerable Chromiums / EOL Electron in Cursor" result is **self-reported and unverified**.

## What checks out

- **Playwright cache paths** (official [Browsers docs](https://playwright.dev/docs/browsers)): Windows `%USERPROFILE%\AppData\Local\ms-playwright`; macOS `~/Library/Caches/ms-playwright`; Linux `~/.cache/ms-playwright`. Override with `PLAYWRIGHT_BROWSERS_PATH`. Playwright also lists installs and can uninstall with `npx playwright install --list` / `npx playwright uninstall` (and `--all`). Prefer those over a free-range delete of anything named chromium.
- **Puppeteer** keeps its own browser cache (commonly under `~/.cache/puppeteer` or a project-local path). Separate from Playwright; worth scanning, but paths are not in the Playwright docs.
- **Playwright MCP flags** (official [@playwright/mcp README](https://github.com/microsoft/playwright-mcp/blob/main/README.md)): `--browser` accepts `chrome`, `firefox`, `webkit`, `msedge`; `--sandbox` enables the sandbox; `--no-sandbox` disables it (common in Docker). So `--browser chrome --sandbox` is a documented combo. Channel `chrome` uses the machine's installed Google Chrome (Playwright docs: branded Chrome/Edge are not the default download; `channel: 'chrome'` opts into the Stable install). That only stays patched if system Chrome itself updates.
- **Electron floors** look real as of early Nov 2026: [releases.electronjs.org](https://releases.electronjs.org/?channel=stable) lists **45.2.1** (Chromium 156.0.8078.75), **44.10.1**, **43.8.6**, each with upstream Chromium backports. Useful as "supported line" minima; not proof that Cursor (or any named app) is EOL.

## Caveats / unverified

- Tip author, not a security vendor. Paste-prompt framing.
- Full post text only via `note_tweet`; do not trust truncated timeline text alone.
- Playwright browser folders are often revision-named (`chromium-XXXXXX`), not Chrome version directories. An agent that deletes by comparing folder names to `156.0.8078.73` may miss or mis-delete; it should read VERSION / ABOUT files inside builds, or use `npx playwright install --list` and bump the Playwright package then reinstall.
- Blind "delete older than X on this machine" can break local tests until `npx playwright install` runs again. Safer: update Playwright, reinstall browsers, then uninstall unused ones.
- `--sandbox` is not the same as "more secure than Chrome Stable". It turns the Chromium sandbox on for the MCP launch; Docker images often need `--no-sandbox` and say so.
- "EOL Electron in Cursor" and the three-cache find: **unverified**.
- Author reply to @nkozyra that "Claude asks before every delete" depends on Claude Code permission settings; not a general agent guarantee.

## Useful replies

- **@nkozyra**: telling an agent to find and delete things "on this machine" is risky. Keep this as the main process lesson: scope destructive agent commands (workspace-only, list then approve, no blanket AppData wipes).
- **@dave_deguzza** (reply): claims Claude asks and shows the full path before each delete. True only if approval mode is on.
- **@BoboLinNotes**: generic praise for agents auditing local security state.
- **@mayankbhaskarrr**: calls `--sandbox` the quiet hero.
- **@Joshua_WD**: browser binaries eat disk; cleanup is useful even without the CVE angle.

## For the software factory (GHCP)

- **Playwright MCP is a default** on Copilot cloud agent, limited by default to localhost/127.0.0.1. Docs: [MCP concepts](https://docs.github.com/en/copilot/concepts/customizations/mcp), [configure MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers). Prefer explicit `tools` allowlists over `*`.
- **Firewall / allowlist**: the coding-agent firewall's recommended allowlist includes Playwright browser-download hosts, but the firewall **does not** apply to MCP server processes. Docs: [customizing the firewall](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent), [allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference).
- **Local MCP config**: if Sam runs `@playwright/mcp` in Copilot CLI / IDE, `--browser chrome --sandbox` (or `msedge`) is a documented way to ride OS auto-update instead of a stale `ms-playwright` Chromium. On CI runners, prefer installing a current Chrome/Edge or pinning a fresh Playwright browser install in `copilot-setup-steps.yml` / setup steps rather than hoping an old cache is fine.
- **Refresh, don't only delete**: bump `@playwright/test` (or the MCP package), run `npx playwright install`, then `npx playwright uninstall` for leftovers. Mirror that in Actions so coding-agent and Agentic Workflow jobs do not reuse ancient browser layers in the cache.
- **Dependabot / Agentic Workflow**: a scheduled check that flags Playwright (and Electron, if the factory ships a desktop shell) below known floors, or that diffs installed browser versions against the latest Chrome Stable security train, is more durable than a one-shot Claude paste.
- **Destructive scope** (take @nkozyra seriously): factory skills that clean caches must constrain paths (explicit `ms-playwright` / `puppeteer` dirs), list candidates, and require human approval before delete. Never "on this machine" as an unbounded root.
