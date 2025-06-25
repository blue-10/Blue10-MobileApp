const eslintPlugin = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      'ios/',
      'android/',
      'coverage/',
      '.expo/',
      '.expo-shared/',
      'assets/',
    ],
  },
];
