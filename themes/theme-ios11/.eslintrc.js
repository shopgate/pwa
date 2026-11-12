module.exports = {
  extends: '@shopgate/eslint-config',
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
