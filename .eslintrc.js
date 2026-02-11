module.exports = {
  root: true,
  extends: '@shopgate/eslint-config',
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    'no-param-reassign': ['warn', {
      props: true,
      ignorePropertyModificationsFor: [
        'draft',
      ],
    }],
  },
};
