import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  {
    ignores: [
      // Dependencies
      'node_modules/**',

      // Build output
      'dist/**',
      'build/**',

      // Coverage reports
      'coverage/**',

      // Logs
      'logs/**',
      '*.log',

      // Temporary files
      'tmp/**',
      'temp/**',

      // Environment variables
      '.env',
      '.env.local',
      '.env.*.local',

      // IDE files
      '.vscode/**',
      '.idea/**',

      // Other
      '*.min.js'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // General ESLint rules
      'no-console': ['warn', { allow: ['log', 'warn', 'error', 'info'] }], // Allow more console methods for backend development
      'no-unused-vars': 'off', // TypeScript has its own version
      'no-undef': 'off', // TypeScript handles this
      'no-useless-escape': 'warn', // Downgrade from error to warning

      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'off', // Turn off for now to ease migration
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], // Downgrade to warning
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/order': [
        'warn', // Downgraded from error to warning
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        },
      ],
    },
  },
  prettier,
];
