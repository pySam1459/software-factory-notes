import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'copilot-pretooluse-guard.mjs');
const run = (payload) => {
  const r = spawnSync('node', [SCRIPT], { input: JSON.stringify(payload), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout ? JSON.parse(r.stdout) : null;
};
const shell = (command) => run({ toolName: 'bash', toolArgs: JSON.stringify({ command }) });

test('allows ordinary commands and edits', () => {
  assert.equal(shell('npm test -- src/features/foo'), null);
  assert.equal(shell('git commit -m "fix: thing"'), null);
  assert.equal(run({ toolName: 'edit', toolArgs: { path: 'src/features/foo/Foo.tsx' } }), null);
  assert.equal(shell('rm -rf dist'), null);
});

test('denies hook skipping, force push, suppressions, snapshot updates, deleting tests', () => {
  for (const c of ['git commit -n -m x', 'git commit -am x --no-verify', 'git push --force origin HEAD', 'npx eslint . --suppress-all', 'npx vitest run -u', 'rm src/foo.test.ts', 'git rm src/__tests__/a.ts']) {
    assert.equal(shell(c)?.permissionDecision, 'deny', c);
  }
});

test('denies edits to guard config, in both payload formats', () => {
  assert.equal(run({ toolName: 'edit', toolArgs: JSON.stringify({ path: 'eslint.config.mjs' }) })?.permissionDecision, 'deny');
  assert.equal(run({ tool_name: 'create', tool_input: { file_path: 'packages\\app\\tsconfig.json' } })?.permissionDecision, 'deny');
  assert.equal(run({ toolName: 'view', toolArgs: { path: 'tsconfig.json' } }), null);
});
