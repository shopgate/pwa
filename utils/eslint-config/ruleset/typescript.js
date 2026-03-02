module.exports = {
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'jsdoc'],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        // Prefer TS variants
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',

        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-shadow': 'warn',
        '@typescript-eslint/no-use-before-define': 'warn',

        // Common TS ergonomics (tune as you like)
        '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

        'valid-jsdoc': 'off',
        // Require JSDoc only for "public" (exported) APIs.
        'jsdoc/require-jsdoc': ['warn', {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
          },
        }],
        // Require JSDoc Description only for "public" (exported) APIs.
        'jsdoc/require-description': ['warn', {
          contexts: [
          // export function foo() {}
            'ExportNamedDeclaration > FunctionDeclaration',
            // export const foo = () => {}
            'ExportNamedDeclaration VariableDeclarator > ArrowFunctionExpression',
            // export class Foo {}
            'ExportNamedDeclaration > ClassDeclaration',
            // export default function foo() {}
            // export default function () {}
            'ExportDefaultDeclaration > FunctionDeclaration',
            // export default class Foo {}
            'ExportDefaultDeclaration > ClassDeclaration',
          ],
        }],

        'jsdoc/require-param': 'warn',
        // When @param is provided, it also needs to be described
        'jsdoc/require-param-description': 'warn',

        'jsdoc/require-returns': 'warn',
        // When @returns is provided, it also needs to be described
        'jsdoc/require-returns-description': 'warn',

        // Disallow usage of JSDoc types for params. That's already done by TS
        'jsdoc/no-types': 'error',
        // Check if JSDoc only contains valid tags e.g. @example or @deprecated
        'jsdoc/check-tag-names': 'warn',
        // Check if param names match function names
        'jsdoc/check-param-names': 'warn',
        // Reports invalid alignment of JSDoc block asterisks.
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-line-alignment': 'warn',
        'jsdoc/sort-tags': 'warn',

        'react/jsx-filename-extension': [
          'error',
          { extensions: ['.jsx', '.tsx'] }, // Allow JSX in .tsx files
        ],
        // Special max-len rules for TS files that allow longer lines in comments
        'max-len': ['error', 100, 2, {
          ignoreUrls: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        }],
      },
    },
    // Rules for  React components in .tsx files
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
      },
    },
  ],
};
