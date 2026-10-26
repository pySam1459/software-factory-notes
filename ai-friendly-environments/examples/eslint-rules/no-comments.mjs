const DEFAULT_ALLOW = [
  '^\\s*eslint-(disable|enable)',
  '^\\s*(global|globals|exported)\\s',
  '^\\s*@ts-expect-error\\s.*agent-exception',
  '^\\s*@vitest-environment\\s',
  '^\\s*@jest-environment\\s',
  '^/ <reference ',
  '^[*!]?\\s*@(license|preserve)\\b',
  '^\\s*#__(PURE|NO_SIDE_EFFECTS)__\\s*$',
  '^\\s*quirk: https?://\\S+',
];

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow code comments. Encode the intent in names, types, lint rules or tests instead.' },
    schema: [
      {
        type: 'object',
        properties: { allow: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      noComment:
        'Comments are banned: agents copy them and treat workarounds as precedent. Delete it, or move the intent into a name, a type, a lint rule or a test. A real platform quirk may stay as "quirk: <link to the bug>".',
      directiveNeedsException:
        'eslint-disable needs an exception: add `-- agent-exception reason="..." expires=YYYY-MM-DD approver=<name>`.',
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allow = [...DEFAULT_ALLOW, ...(options.allow ?? [])].map((p) => new RegExp(p));
    const sourceCode = context.sourceCode;
    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type === 'Shebang') continue;
          const text = comment.value;
          if (/^\s*eslint-disable/.test(text) && !/agent-exception\s+reason="[^"]+"\s+expires=\d{4}-\d{2}-\d{2}\s+approver=\S+/.test(text)) {
            context.report({ loc: comment.loc, messageId: 'directiveNeedsException' });
            continue;
          }
          if (allow.some((re) => re.test(text))) continue;
          context.report({ loc: comment.loc, messageId: 'noComment' });
        }
      },
    };
  },
};
