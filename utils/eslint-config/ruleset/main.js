module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    jest: true,
    mocha: true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'capitalized-comments': 0,
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
      },
    ],
    'no-restricted-syntax': [
      'error',
      // Rules copied from airbnb base ruleset
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      // Disallow named imports from JSON files since it violates the ESM specifications
      {
        selector:
          'ImportDeclaration[source.value=/\\.([Jj][Ss][Oo][Nn]|[Jj][Ss][Oo][Nn]5)(?:$|[?#])/] > ImportSpecifier',
        message:
          'Named imports from JSON are not allowed since they will not be supported by Webpack in future versions. Import the default and destructure.',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/named': 'error',
    'no-multiple-empty-lines': [2, {
      max: 1,
      maxBOF: 0,
      maxEOF: 1,
    }],
    'no-prototype-builtins': 'off',
    'require-jsdoc': [2, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
      },
    }],
    // Reference: http://eslint.org/docs/rules/valid-jsdoc
    'valid-jsdoc': [2, {
      requireReturn: false,
      requireReturnDescription: false,
      preferType: {
        Boolean: 'boolean',
        Number: 'number',
        String: 'string',
        object: 'Object',
        array: 'Array',
        function: 'Function',
      },
    }],
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,

    // ## Fixes of Airbnb rules for our use cases

    // Error on inconsistent line breaks in function parentheses
    'function-paren-newline': ['error', 'consistent'],
    'no-restricted-exports': [
      'warn',
      {
      // Allow export { default } from '...';
        restrictDefaultExports: { defaultFrom: false },
      },
    ],
    // Just warn about non-camelcase variables since sometimes they are required (e.g., API data)
    camelcase: 'warn',
    // Just warn about class methods that don't use 'this' to avoid heavy refactoring
    'class-methods-use-this': 'warn',
    // Just warn about unexpected side effects by using async functions as Promise executors
    'no-async-promise-executor': 'warn',
    // Just warn about circular dependencies since they are hard to avoid completely
    'import/no-cycle': 'warn',

    // Omit parentheses when there is only one argument to an arrow function
    'arrow-parens': [
      'error',
      'as-needed',
      { requireForBlockBody: true },
    ],

    // ## ESLint complain makes sense - revisit at the next refactoring

    // In functions parameters with default values should be last - violated e.g. in reducers where
    // state = initialState is the first parameter, but the action parameter has no default value.
    'default-param-last': 'warn',
    // In switch statements, require 'default' case to be last
    'default-case-last': 'warn',
    // Return values of Promise executor functions don't make sense
    'no-promise-executor-return': 'warn',
    // Prefer Object spread over Object.assign
    'prefer-object-spread': 'warn',
    // Catch blocks that only rethrow the caught error are redundant
    'no-useless-catch': 'warn',
    // Prefer regex literals over RegExp constructor
    'prefer-regex-literals': 'warn',

    // ## Autofixable - can be removed when ESLint update pull request is merged
    indent: 'warn',
    semi: ['warn', 'always'],
  },
  // Overrides for files that are tests or mocks
  overrides: [
    {
      files: [
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.mock.js',
        '**/*.mock.jsx',
        '**/spec.js',
        '**/spec.jsx',
        '**/mock.js',
        '**/mock.jsx',
      ],
      rules: {
        // Allow more than one class per file in test files
        'max-classes-per-file': 'off',
        // Allow non-camelcase names in test files (e.g., snake_case from API)
        camelcase: 'off',
      },
    },
  ],
  settings: {
    'import/extensions': [
      '.js',
      '.json',
      '.jsx',
    ],
    'import/resolver': {
      exports: {},
      node: {},
    },
  },
};
