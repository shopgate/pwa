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
    'react/react-in-jsx-scope': 'off',
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
    // Warn about unstable nested components, but allow them as props to other components
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    // Don't care about placement of static properties in React components
    'react/static-property-placement': 'off',
    // Allow prop spreading
    'react/jsx-props-no-spreading': 'off',
    // Allow function components to be defined using arrow functions
    'react/function-component-definition': 'off',
    // Warn about usage of .bind() or array functions in JSX props
    'react/jsx-no-bind': 'warn',

    // ## TBD
    'react/jsx-curly-newline': ['warn', 'consistent'],

    // ## ESLint complain makes sense - revisit at the next refactoring

    'react/state-in-constructor': 'warn',

    // ## Autofixable - can be removed when ESLint update pull request is merged
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-indent-props': 'warn',
    'react/jsx-fragments': 'warn',
  },
};
