module.exports = {
  plugins: [
    'react-hooks',
    'flowtype',
  ],
  rules: {
    'react/sort-prop-types': [2, {
      callbacksLast: false,
      ignoreCase: true,
      requiredFirst: true,
    }],
    'react/destructuring-assignment': 0,
    'react/jsx-wrap-multilines': 0,
    'jsx-a11y/label-has-for': 0,
    'react-hooks/rules-of-hooks': 1,
    'react-hooks/exhaustive-deps': 1,
    // Added this according to: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md#rule-options
    'react/sort-comp': ['error', {
      order: [
        'static-methods',
        'lifecycle',
        'everything-else',
        'render',
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
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
    }],
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
  },
};