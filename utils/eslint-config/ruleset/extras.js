module.exports = {
  extends: [
    'plugin:eslint-comments/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: [
    'extra-rules',
    'json',
    'cypress',
  ],
  rules: {
    'extra-rules/no-commented-out-code': 2,
    'extra-rules/no-single-line-objects': 1,
    'extra-rules/potential-point-free': 1,
    'eslint-comments/disable-enable-pair': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
  },
};
