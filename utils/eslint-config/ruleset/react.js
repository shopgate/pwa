module.exports = {
  plugins: ['react-hooks'],
  rules: {
    'react/sort-prop-types': [
      'error',
      {
        callbacksLast: false,
        ignoreCase: true,
        requiredFirst: true,
      },
    ],
    'react/destructuring-assignment': 'off',
    'react/jsx-wrap-multilines': 'off',
    'jsx-a11y/label-has-for': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    // Added this according to: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md#rule-options
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-variables',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render',
        ],
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'defaultProps',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'constructor',
            'getDefaultProps',
            'state',
            'getInitialState',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
        },
      },
    ],

    // ## Fixes of Airbnb rules for our use cases
    'react/no-unknown-property': ['error', { ignore: ['test-id'] }],
    'function-paren-newline': ['error', 'consistent'],
    'function-call-argument-newline': ['warn', 'consistent'],
    'no-restricted-exports': [
      'warn',
      {
      // Allow export { default } from '...';
        restrictDefaultExports: { defaultFrom: false },
      },
    ],
    camelcase: 'warn',
    'class-methods-use-this': 'warn',
    // Warn about unexpected side effects by using async functions as Promise executors
    'no-async-promise-executor': 'warn',
    // Just warn about circular dependencies since they are hard to avoid completely
    'import/no-cycle': 'warn',
    // Warn about unstable nested components, but allow them as props to other components
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'arrow-parens': [
      'error',
      'as-needed',
      { requireForBlockBody: true },
    ],
    // Don't care about placement of static properties in React components
    'react/static-property-placement': 'off',
    // Allow prop spreading
    'react/jsx-props-no-spreading': 'off',
    // Allow function components to be defined using arrow functions
    'react/function-component-definition': 'off',

    // ## TBD
    'react/jsx-curly-newline': 'warn',
    'react/jsx-no-bind': 'warn',

    // ## ESLint complain makes sense - revisit at the next refactoring

    'react/state-in-constructor': 'warn',
    // In functions parameters with default values should be last
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

    // ## Autofixable
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-indent-props': 'warn',
    'react/jsx-fragments': 'warn',
    indent: 'warn',
    semi: ['warn', 'always'],
  },
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
};
