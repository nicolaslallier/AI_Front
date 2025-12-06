import js from '@eslint/js';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import * as parserTypeScript from '@typescript-eslint/parser';
import configPrettier from '@vue/eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginVue from 'eslint-plugin-vue';
import * as parserVue from 'vue-eslint-parser';

/**
 * ESLint 9 flat configuration
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.husky/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: parserTypeScript,
      },
    },
  },
  {
    files: ['**/*.{js,ts,tsx,jsx}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      jsdoc: pluginJsdoc,
      import: pluginImport,
    },
    rules: {
      // Code style enforcement
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],

      // Import ordering
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'object'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Vue specific rules
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
        },
      ],
      'vue/multi-word-component-names': 'error',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/v-on-event-hyphenation': ['error', 'always'],

      // TypeScript specific
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // JSDoc enforcement
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',

      // SOLID principles support
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      complexity: ['error', 10],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-description': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['**/__tests__/**', '**/*.{spec,test}.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        vitest: true,
      },
    },
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'max-lines-per-function': 'off',
    },
  },
  configPrettier,
];
