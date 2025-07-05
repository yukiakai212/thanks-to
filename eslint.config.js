import { defineConfig } from 'eslint/config';
export default defineConfig([
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]);
