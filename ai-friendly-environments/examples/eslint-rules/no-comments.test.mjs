import { RuleTester } from 'eslint';
import rule from './no-comments.mjs';

const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } });

tester.run('no-comments', rule, {
  valid: [
    'const a = 1;',
    '#!/usr/bin/env node\nconst a = 1;',
    '// quirk: https://bugs.webkit.org/show_bug.cgi?id=123456\nconst a = 1;',
    '/*! @license MIT */\nconst a = 1;',
    'const f = /*#__PURE__*/ g();',
    '// eslint-disable-next-line no-console -- agent-exception reason="ops needs this log" expires=2026-12-31 approver=sam\nconsole.log(1);',
    { code: '// keep: generated\nconst a = 1;', options: [{ allow: ['^\\s*keep: generated$'] }] },
  ],
  invalid: [
    { code: '// TODO: fix later\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
    { code: '/* workaround for flaky API, Lauren said never do this */\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
    { code: '/** Adds numbers. */\nexport function add(a, b) { return a + b; }', errors: [{ messageId: 'noComment' }] },
    { code: '// eslint-disable-next-line no-console\nconsole.log(1);', errors: [{ messageId: 'directiveNeedsException' }] },
  ],
});
console.log('no-comments: all RuleTester cases passed');
