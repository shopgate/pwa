module.exports = {
  extends: [
    'plugin:eslint-comments/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: [
    'extra-rules',
    'json',
    'cypress',
    'tss-unused-classes',
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
    'tss-unused-classes/unused-classes': 'warn',
    'no-restricted-imports': ['warn', {
      paths: [
        {
          name: '@shopgate/pwa-ui-shared/AddToCartButton/style',
          message: 'Deprecated and will be removed. Use AddToCartButton from @shopgate/engage/components (its successCount prop plays the checkmark for adds outside the click) or style the button with makeStyles from @shopgate/engage/styles.',
        },
        {
          name: 'glamor',
          message: 'glamor is deprecated and will be removed. Write styles with makeStyles from @shopgate/engage/styles.',
        },
      ],
    }],
  },
};
