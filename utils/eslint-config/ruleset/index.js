module.exports = {
  extends: [
    './main',
    './react',
    './extras',
  ].map(require.resolve),
  rules: {},
};
