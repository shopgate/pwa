module.exports = {
  plugins: [
    'react-hooks',
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
    'react-hooks/exhaustive-deps': 2,
  },
};
