module.exports = {
  extends: ['eslint-config-ali/typescript/node'],
  rules: {
    '@typescript-eslint/no-require-imports': 0,
    semi: [1, 'always'],
    quotes: [1, 'single'],
    'import/no-cycle': 'off',
    'max-len': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
        pathGroups: [
          {
            pattern: '/@/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
    'vue/require-default-prop': 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
