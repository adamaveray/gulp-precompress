/* eslint sort-keys: "error" -- Organise rules */

import { globals, makeEslintConfig } from '@averay/codeformat';

export default [
  {
    ignores: ['coverage/**/*', 'dist/**/*'],
  },
  ...makeEslintConfig({ tsconfigPath: './tsconfig.json' }),
  {
    files: ['src/**/*'],
    languageOptions: {
      globals: { ...globals.node, NodeJS: 'readonly' },
    },
  },
  {
    files: ['test/**/*', 'types/jest.d.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest, NodeJS: 'readonly' },
    },
  },
];
