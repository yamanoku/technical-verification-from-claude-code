import js from '@eslint/js';
import tailwindcss from 'eslint-plugin-tailwindcss';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

export default [
  // Base configuration for all JavaScript files
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: 'readonly',
        node: 'readonly',
        es2021: true,
      },
    },
    plugins: {
      tailwindcss,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tailwindcss.configs.recommended.rules,
      // Enable all Tailwind CSS rules for comprehensive testing
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for testing
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'off', // Allow custom classes for testing
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    },
    settings: {
      tailwindcss: {
        // Tailwind v4 CSS-first configuration
        config: './tailwind.css',
        cssFiles: [
          '**/*.css',
          '!**/node_modules',
          '!**/.*',
          '!**/dist',
          '!**/build',
        ],
      },
    },
  },
  
  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: 'readonly',
        node: 'readonly',
        es2021: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      tailwindcss,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...tailwindcss.configs.recommended.rules,
      // Enable all Tailwind CSS rules for comprehensive testing
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for testing
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'off', // Allow custom classes for testing
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    },
    settings: {
      tailwindcss: {
        config: './tailwind.css',
        cssFiles: [
          '**/*.css',
          '!**/node_modules',
          '!**/.*',
          '!**/dist',
          '!**/build',
        ],
      },
    },
  },
  
  // Vue configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: 'readonly',
        node: 'readonly',
        es2021: true,
      },
    },
    plugins: {
      tailwindcss,
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
      // Enable all Tailwind CSS rules for comprehensive testing
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for testing
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'off', // Allow custom classes for testing
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    },
    settings: {
      tailwindcss: {
        config: './tailwind.css',
        cssFiles: [
          '**/*.css',
          '!**/node_modules',
          '!**/.*',
          '!**/dist',
          '!**/build',
        ],
      },
    },
  },
];