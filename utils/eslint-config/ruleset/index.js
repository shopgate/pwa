module.exports = {
  extends: [
    './main',
    './react',
    './extras',
    './typescript',
  ].map(require.resolve),
  rules: {},
};
