import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'check-agent-gaming.mjs');

function repo(files) {
  const dir = mkdtempSync(join(tmpdir(), 'cag-'));
  const g = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
  g('init', '-q', '-b', 'main');
  g('config', 'user.name', 'test');
  g('config', 'user.email', 'test@example.invalid');
  write(dir, files);
  g('add', '-A');
  g('commit', '-q', '-m', 'base');
  g('checkout', '-q', '-b', 'feature');
  return { dir, g };
}
function write(dir, files) {
  for (const [p, c] of Object.entries(files)) {
    const f = join(dir, p);
    mkdirSync(dirname(f), { recursive: true });
    if (c === null) rmSync(f); else writeFileSync(f, c);
  }
}
function run(dir, ...extra) {
  const r = spawnSync('node', [SCRIPT, '--today', '2026-10-26', ...extra], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
}
function commit(r, files) { write(r.dir, files); r.g('add', '-A'); r.g('commit', '-q', '-m', 'change'); }

const BASE = {
  'src/a.ts': 'export const a = 1;\n',
  'src/a.test.ts': "import { a } from './a';\ntest('one', () => {});\ntest('two', () => {});\n",
  'src/b.test.ts': "test('b', () => {});\n",
  'tsconfig.json': '{\n  "compilerOptions": {\n    "strict": true\n  }\n}\n',
  'eslint-suppressions.json': JSON.stringify({ 'src/old.ts': { 'no-restricted-syntax': { count: 2 } } }, null, 2),
};

test('clean change passes', () => {
  const r = repo(BASE);
  commit(r, { 'src/a.ts': 'export const a = 2;\n' });
  const { code, out } = run(r.dir, '--base', 'main');
  assert.equal(code, 0, out);
});

test('flags deleted test file, skip/only, suppressions, as any, tsconfig loosening, fewer tests', () => {
  const r = repo(BASE);
  commit(r, {
    'src/b.test.ts': null,
    'src/a.test.ts': "import { a } from './a';\ntest.only('one', () => {});\n",
    'src/a.ts': 'export const a = (1 as any);\n// @ts-ignore\nexport const c: string = 1;\n// eslint-disable-next-line no-console\nconsole.log(a);\n',
    'tsconfig.json': '{\n  "compilerOptions": {\n    "strict": false\n  }\n}\n',
    'eslint-suppressions.json': JSON.stringify({ 'src/old.ts': { 'no-restricted-syntax': { count: 3 } } }, null, 2),
  });
  const { code, out } = run(r.dir, '--base', 'main');
  assert.equal(code, 1, out);
  for (const s of ['Deleted test file', '.only', '`as any`', '@ts-ignore', 'eslint-disable', 'Type checking loosened', 'Net removal of 1 test case', 'New ESLint suppression']) {
    assert.ok(out.includes(s), `missing "${s}" in:\n${out}`);
  }
});

test('valid agent-exception allows a line, expired one is reported', () => {
  const r = repo(BASE);
  commit(r, {
    'src/a.ts': [
      'export const a = 1;',
      '// eslint-disable-next-line no-console -- agent-exception reason="startup log required by ops" expires=2026-12-31 approver=sam',
      'console.log(a);',
      '// eslint-disable-next-line no-console -- agent-exception reason="old" expires=2026-01-01 approver=sam',
      'console.log(a);',
      '',
    ].join('\n'),
  });
  const { code, out } = run(r.dir, '--base', 'main');
  assert.equal(code, 1, out);
  assert.match(out, /expired on 2026-01-01/);
  assert.equal(out.match(/New eslint-disable/g), null, out);
});

test('--staged checks the index and --scope limits paths', () => {
  const r = repo(BASE);
  write(r.dir, { 'src/a.ts': 'export const a = 1 as any;\n', 'other/x.ts': 'export const x = 1 as any;\n' });
  r.g('add', '-A');
  let res = run(r.dir, '--staged');
  assert.equal(res.code, 1, res.out);
  assert.match(res.out, /other\/x\.ts/);
  res = run(r.dir, '--staged', '--scope', 'src');
  assert.equal(res.code, 1, res.out);
  assert.doesNotMatch(res.out, /other\/x\.ts/);
});

test('flags pytest.mark.skip, xfail and pytest.skip', () => {
  const r = repo({
    ...BASE,
    'tests/test_notes.py': 'def test_ok():\n    assert True\n',
  });
  commit(r, {
    'tests/test_notes.py': [
      'import pytest',
      '',
      '@pytest.mark.skip',
      'def test_ok():',
      '    assert True',
      '',
      '@pytest.mark.xfail',
      'def test_later():',
      '    assert False',
      '',
      'def test_dynamic():',
      '    pytest.skip("no")',
      '',
    ].join('\n'),
  });
  const { code, out } = run(r.dir, '--base', 'main');
  assert.equal(code, 1, out);
  const hits = out.split('\n').filter((line) => line.includes('New pytest skip or xfail'));
  assert.equal(hits.length, 3, out);
});

test('azure format emits logissue commands', () => {
  const r = repo(BASE);
  commit(r, { 'src/a.ts': 'export const a = 1 as any;\n' });
  const { out } = run(r.dir, '--base', 'main', '--format', 'azure');
  assert.match(out, /^##vso\[task\.logissue type=error;sourcepath=src\/a\.ts;linenumber=1\]/m);
});
