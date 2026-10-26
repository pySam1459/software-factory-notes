#!/usr/bin/env node
// Copilot preToolUse hook: reads the hook payload on stdin and prints a deny decision, or nothing to allow.
// Accepts both the camelCase payload ({ toolName, toolArgs }) and the VS Code-compatible one ({ tool_name, tool_input }).
// toolArgs may arrive as a JSON string, so it is parsed when needed.
import { readFileSync } from 'node:fs';

const PROTECTED = [
  /(^|[\\/])eslint\.config\.[cm]?[jt]s$/,
  /(^|[\\/])eslint-suppressions\.json$/,
  /(^|[\\/])tsconfig[^\\/]*\.json$/,
  /(^|[\\/])\.github[\\/]hooks[\\/]/,
  /(^|[\\/])\.githooks[\\/]/,
  /(^|[\\/])azure-pipelines[^\\/]*\.ya?ml$/,
  /(^|[\\/])scripts[\\/](check-agent-gaming|copilot-pretooluse-guard)\.mjs$/,
];
const TEST_PATH = /(^|[\\/])__tests__[\\/]|\.(test|spec)\.[cm]?[jt]sx?\b|\.snap\b/;

const SHELL_RULES = [
  [/\bgit\s+commit\b[^|;&]*\s(--no-verify|-n)\b/, 'Do not skip git hooks. Fix whatever the pre-commit hook reports.'],
  [/\bgit\s+push\b[^|;&]*\s(--force\b|-f\b|--force-with-lease\b)/, 'Force pushes need a human. Push a new commit instead.'],
  [/\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)/, 'Destructive git command. Ask Sam first.'],
  [/\beslint\b[^|;&]*--suppress-(all|rule)\b/, 'Do not add ESLint suppressions. Fix the new violations; the baseline may only shrink (--prune-suppressions).'],
  [/\b(vitest|jest)\b[^|;&]*\s(-u|--update(Snapshot)?)\b/, 'Do not bulk-update snapshots. Read the diff and update only the snapshots whose change you can explain, then say why in the PR.'],
  [/\b(rm|del|Remove-Item|git\s+rm)\b[^|;&]*/, null],
];

function decide(payload) {
  const tool = payload.toolName ?? payload.tool_name ?? '';
  let a = payload.toolArgs ?? payload.tool_input ?? {};
  if (typeof a === 'string') { try { a = JSON.parse(a); } catch { a = { command: a }; } }
  if (typeof a.command === 'string') {
    const cmd = a.command;
    for (const [re, why] of SHELL_RULES) {
      const m = re.exec(cmd);
      if (!m) continue;
      if (why) return why;
      if (TEST_PATH.test(m[0])) return 'Deleting tests needs a human. If a test is wrong, fix it; if it is obsolete, say so and ask Sam.';
    }
    return null;
  }
  const path = a.path ?? a.file_path ?? a.filePath;
  if (typeof path === 'string' && !/^(view|read)/i.test(tool)) {
    if (PROTECTED.some((re) => re.test(path))) return `${path} is guard configuration (lint, types, hooks, CI). Agents may not change it; describe the change you want and ask Sam.`;
  }
  return null;
}

let input = '';
try { input = readFileSync(0, 'utf8'); } catch { process.exit(0); }
let payload;
try { payload = JSON.parse(input); } catch { process.exit(0); }
const reason = decide(payload);
if (reason) process.stdout.write(JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: reason }));
