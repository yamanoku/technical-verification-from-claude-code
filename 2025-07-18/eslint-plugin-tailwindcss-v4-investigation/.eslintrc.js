module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['tailwindcss'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
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
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'tailwindcss'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:tailwindcss/recommended',
      ],
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      plugins: ['tailwindcss'],
      extends: ['plugin:tailwindcss/recommended'],
    },
  ],
  settings: {
    tailwindcss: {
      // Test with both Tailwind v3 and v4 configurations
      config: './tailwind.config.js',
      cssFiles: [
        '**/*.css',
        '!**/node_modules',
        '!**/.*',
        '!**/dist',
        '!**/build',
      ],
    },
  },
};