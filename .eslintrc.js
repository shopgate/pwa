module.exports = {
  root: true,
  extends: '@shopgate/eslint-config',
  rules: {
    'rulesdir/missing-extension-config': 'error',
    'react/no-danger': ['error', { customComponentNames: ['*'] }],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
