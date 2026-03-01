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
        'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],

        'jsdoc/require-description': 'warn',
        'jsdoc/check-tag-names': 'warn',
        'jsdoc/no-types': 'error',
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off',

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
