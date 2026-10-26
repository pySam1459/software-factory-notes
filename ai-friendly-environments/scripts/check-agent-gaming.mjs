#!/usr/bin/env node
// Usage:
//   node scripts/check-agent-gaming.mjs --base origin/main [--scope src/features/foo ...] [--format azure]
//   node scripts/check-agent-gaming.mjs --staged [--scope ...]
// Flags, in the diff only: deleted or renamed-away test and snapshot files, net removal of test cases,
// new .skip/.only/xit/fit, new pytest.mark.skip/skipif/xfail and pytest.skip/xfail, new eslint-disable /
// @ts-ignore / @ts-expect-error / @ts-nocheck / `as any` / `as unknown as`, new entries in
// eslint-suppressions.json, and strictness flags switched off in tsconfig.
// An added line is allowed if it, or the line above it, carries:
//   agent-exception reason="..." expires=YYYY-MM-DD approver=<name>
// and the expiry date has not passed. Exit code 1 if anything is flagged.
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = { base: null, staged: false, scopes: [], format: 'text', today: new Date().toISOString().slice(0, 10) };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--base') opt.base = args[++i];
  else if (a === '--staged') opt.staged = true;
  else if (a === '--scope') opt.scopes.push(args[++i]);
  else if (a === '--format') opt.format = args[++i];
  else if (a === '--today') opt.today = args[++i];
  else if (a === '-h' || a === '--help') { console.log('see header of scripts/check-agent-gaming.mjs'); process.exit(0); }
  else { console.error(`unknown argument: ${a}`); process.exit(2); }
}
if (!opt.staged && !opt.base) {
  const target = process.env.SYSTEM_PULLREQUEST_TARGETBRANCH;
  opt.base = target ? `origin/${target.replace(/^refs\/heads\//, '')}` : 'origin/main';
}

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const gitMaybe = (...a) => { try { return git(...a); } catch { return null; } };

const scopeArgs = opt.scopes.length ? ['--', ...opt.scopes] : [];
let diffArgs, baseSpec, headSpec;
if (opt.staged) {
  diffArgs = ['--cached'];
  baseSpec = (p) => `HEAD:${p}`;
  headSpec = (p) => `:${p}`;
} else {
  const mb = git('merge-base', opt.base, 'HEAD').trim();
  diffArgs = [mb, 'HEAD'];
  baseSpec = (p) => `${mb}:${p}`;
  headSpec = (p) => `HEAD:${p}`;
}

const TEST_FILE = /(^|\/)__tests__\/|\.(test|spec)\.[cm]?[jt]sx?$/;
const SNAPSHOT_FILE = /\.snap$/;
const TEST_CASE = /\b(it|test)(\.(only|skip|todo|concurrent|each\s*\(.*?\)))*\s*\(/;
const FOCUS_SKIP = /\b(describe|it|test|suite)\.(only|skip)\b|\b(xit|xtest|xdescribe|fit|fdescribe)\s*\(/;
const PYTEST_SKIP = /(?:\bpytest\.mark\.(?:skip|skipif|xfail)\b|\bpytest\.(?:skip|xfail)\s*\()/;
const SUPPRESSION = [
  [/eslint-disable(-next-line|-line)?\b/, 'eslint-disable directive', 'Fix the code so the rule passes. If it truly cannot, add an agent-exception with reason, expiry and approver.'],
  [/@ts-ignore\b/, '@ts-ignore', 'Fix the type error. Narrow with a type guard or parse at the boundary (e.g. a zod schema).'],
  [/@ts-nocheck\b/, '@ts-nocheck', 'Remove it and fix the type errors in this file.'],
  [/@ts-expect-error\b/, '@ts-expect-error', 'Fix the type error instead of expecting it.'],
  [/\bas\s+any\b/, '`as any`', 'Use a precise type, `unknown` plus a type guard, or parse at the boundary.'],
  [/\bas\s+unknown\s+as\b/, '`as unknown as` double cast', 'Fix the types so no double cast is needed.'],
];
const TS_STRICT_FLAGS = /"(strict|noImplicitAny|strictNullChecks|noUncheckedIndexedAccess|exactOptionalPropertyTypes|noImplicitOverride|noImplicitReturns|noFallthroughCasesInSwitch|useUnknownInCatchVariables|noPropertyAccessFromIndexSignature)"\s*:\s*false/;
const TS_LOOSEN = /"(skipLibCheck|allowJs)"\s*:\s*true|"checkJs"\s*:\s*false/;
const EXCEPTION = /agent-exception\s+reason="([^"]+)"\s+expires=(\d{4}-\d{2}-\d{2})\s+approver=(\S+)/;

const problems = [];
const report = (file, line, msg) => problems.push({ file, line, msg });

const nameStatus = git('diff', '--name-status', '-M', ...diffArgs, ...scopeArgs).trim();
for (const row of nameStatus ? nameStatus.split('\n') : []) {
  const [status, a, b] = row.split('\t');
  if (status === 'D' && (TEST_FILE.test(a) || SNAPSHOT_FILE.test(a))) {
    report(a, 0, `Deleted ${SNAPSHOT_FILE.test(a) ? 'snapshot' : 'test'} file. Restore it, or get a human to approve deleting it and say why in the PR description.`);
  }
  if (status.startsWith('R') && TEST_FILE.test(a) && !TEST_FILE.test(b)) {
    report(b, 0, `Test file renamed to a non-test name (${a} -> ${b}), so the runner no longer picks it up.`);
  }
}

const diff = git('diff', '--no-color', '--no-ext-diff', '-M', '--unified=1', ...diffArgs, ...scopeArgs);
let file = null, newLine = 0, prevAdded = '', removedCases = new Map(), addedCases = new Map();
const isExcepted = (line, prev, where) => {
  const m = EXCEPTION.exec(line) || EXCEPTION.exec(prev);
  if (!m) return false;
  if (m[2] < opt.today) { report(file, where, `agent-exception expired on ${m[2]} (approver ${m[3]}). Fix the code or get the exception renewed.`); }
  return true;
};
for (const raw of diff.split('\n')) {
  if (raw.startsWith('diff --git')) { file = null; prevAdded = ''; continue; }
  if (raw.startsWith('+++ ')) { file = raw === '+++ /dev/null' ? null : raw.slice(6); continue; }
  if (raw.startsWith('--- ')) continue;
  const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw);
  if (h) { newLine = Number(h[1]); prevAdded = ''; continue; }
  if (!file) continue;
  if (raw.startsWith('-')) {
    if (TEST_FILE.test(file) && TEST_CASE.test(raw)) removedCases.set(file, (removedCases.get(file) ?? 0) + 1);
    continue;
  }
  if (raw.startsWith('+')) {
    const line = raw.slice(1);
    const ln = newLine++;
    const excepted = () => isExcepted(line, prevAdded, ln);
    if (TEST_FILE.test(file) && TEST_CASE.test(line)) addedCases.set(file, (addedCases.get(file) ?? 0) + 1);
    if (/\.py$/.test(file) && PYTEST_SKIP.test(line) && !excepted()) {
      report(file, ln, 'New pytest skip or xfail. Make the test pass or delete it with a human\'s approval; never skip tests in a commit.');
    }
    if (/\.[cm]?[jt]sx?$/.test(file)) {
      if (FOCUS_SKIP.test(line) && !excepted()) report(file, ln, 'New .only/.skip (or xit/fit). Make the test pass or delete it with a human\'s approval; never skip or focus tests in a commit.');
      for (const [re, what, fix] of SUPPRESSION) {
        if (re.test(line) && !excepted()) { report(file, ln, `New ${what}. ${fix}`); break; }
      }
    }
    if (/(^|\/)tsconfig[^/]*\.json$/.test(file)) {
      if ((TS_STRICT_FLAGS.test(line) || TS_LOOSEN.test(line)) && !excepted()) report(file, ln, `Type checking loosened: ${line.trim()}. Fix the type errors instead of turning checks off.`);
    }
    prevAdded = line;
    continue;
  }
  if (raw.startsWith(' ')) { newLine++; prevAdded = raw.slice(1); }
}
for (const [f, removed] of removedCases) {
  const added = addedCases.get(f) ?? 0;
  if (removed > added) report(f, 0, `Net removal of ${removed - added} test case(s). Tests may only be removed with a human's approval and a reason in the PR description.`);
}

const changed = nameStatus ? nameStatus.split('\n').map((r) => r.split('\t').at(-1)) : [];
for (const f of changed.filter((p) => /(^|\/)eslint-suppressions\.json$/.test(p))) {
  const read = (spec) => { const s = gitMaybe('show', spec); try { return s ? JSON.parse(s) : {}; } catch { return {}; } };
  const before = read(baseSpec(f));
  const after = read(headSpec(f));
  for (const [path, rules] of Object.entries(after)) {
    for (const [rule, { count }] of Object.entries(rules)) {
      const old = before[path]?.[rule]?.count ?? 0;
      if (count > old) report(f, 0, `New ESLint suppression: ${rule} in ${path} (${old} -> ${count}). Fix the new violation; the baseline may only shrink (eslint --prune-suppressions).`);
    }
  }
}

if (!problems.length) { console.log('check-agent-gaming: no problems found'); process.exit(0); }
for (const p of problems) {
  if (opt.format === 'azure') console.log(`##vso[task.logissue type=error;sourcepath=${p.file}${p.line ? `;linenumber=${p.line}` : ''}]${p.msg}`);
  else console.log(`${p.file}${p.line ? `:${p.line}` : ''}  ${p.msg}`);
}
console.log(`check-agent-gaming: ${problems.length} problem(s)`);
process.exit(1);
