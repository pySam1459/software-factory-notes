import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';
import noComments from './eslint-rules/no-comments.mjs';

const OWNED = ['src/features/my-area/**/*.{ts,tsx}'];

const EFFECT_MESSAGE =
  'useEffect is banned. Derive the value during render, do the work in the event handler, use the data library (e.g. TanStack Query) for fetching, useSyncExternalStore for subscriptions, or a `key` to reset state. If you need to sync with a non-React system, use the wrappers in src/lib/hooks (useMountEffect, useSubscription).';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', '**/*.generated.ts'] },

  { files: ['**/*.{ts,tsx}'], extends: [tseslint.configs.base] },

  {
    files: OWNED,
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { local: { rules: { 'no-comments': noComments } } },
    rules: {
      'local/no-comments': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-nocheck': true, 'ts-check': false, 'ts-expect-error': 'allow-with-description', minimumDescriptionLength: 20 },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: false, requireDefaultForNonUnion: true },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'error',

      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', importNames: ['useEffect', 'useLayoutEffect'], message: EFFECT_MESSAGE },
            { name: 'lodash', message: 'Import the single function from lodash-es, or use the platform API.' },
          ],
          patterns: [
            { group: ['**/internal/**', '**/legacy/**'], message: 'Internal or legacy module. Use the public entry point (index.ts) of the feature instead.' },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "MemberExpression[object.name='React'][property.name=/^use(Layout)?Effect$/]", message: EFFECT_MESSAGE },
        { selector: "TSAsExpression > TSUnknownKeyword", message: 'Do not launder types through `as unknown`. Parse the value at the boundary instead.' },
        { selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]", message: 'setTimeout without a delay is usually a race-condition workaround. Fix the ordering instead.' },
      ],
    },
  },

  {
    files: ['src/lib/hooks/useMountEffect.ts', 'src/lib/hooks/useSubscription.ts'],
    rules: { 'no-restricted-imports': 'off', 'no-restricted-syntax': 'off' },
  },

  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/expect-expect': 'error',
      'vitest/no-conditional-expect': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
);
