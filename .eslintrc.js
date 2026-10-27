module.exports = {
  root: true,
  extends: '@shopgate/eslint-config',
  rules: {
    'rulesdir/missing-extension-config': 'error',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
