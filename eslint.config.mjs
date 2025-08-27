import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  {
    // Global ignores
    ignores: ['node_modules/', '.next/', 'out/', 'build/', 'next-env.d.ts'],
  },
  {
    // Base configuration for all files
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // TypeScript configurations
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // React configurations
  {
    plugins: { react },
    rules: {
      //...react.configs.recommended.rules, // This is too broad and causes issues, enable specific rules instead
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off',
      'react/display-name': 'warn',
    },
  },
  // React Hooks configurations
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  // JSX A11y configurations
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: jsxA11y.configs.recommended.rules,
  },
  // Next.js configurations
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // Prettier configuration (must be last)
  prettierConfig,
)
