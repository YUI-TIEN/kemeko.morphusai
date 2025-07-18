import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astro,
    },
    languageOptions: {
      parser: astro.parser,
    },
    rules: {
      ...astro.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/'],
  },
];