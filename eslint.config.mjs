import eslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
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
