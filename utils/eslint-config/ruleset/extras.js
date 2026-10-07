const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
const configImportPattern = require('../rules/helpers/configImportPattern');

rulesDirPlugin.RULES_DIR = path.join(__dirname, '..', 'rules');

module.exports = {
  extends: [
    'plugin:eslint-comments/recommended',
  ],
  plugins: [
    'extra-rules',
    'json',
    'rulesdir',
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
    'import/no-unresolved': ['error', {
      commonjs: true,
      caseSensitive: true,
      ignore: [configImportPattern],
    }],
    'rulesdir/missing-extension-config': 'warn',
    'no-restricted-imports': ['warn', {
      paths: [
        {
          name: '@shopgate/pwa-ui-shared/AddToCartButton/style',
          message: 'Deprecated and will be removed. Use AddToCartButton from @shopgate/engage/components (its successCount prop plays the checkmark for adds outside the click) or style the button with makeStyles from @shopgate/engage/styles.',
        },
        {
          name: 'glamor',
          message: 'glamor is deprecated and will be removed. Write styles with makeStyles and global styles with injectGlobal, both from @shopgate/engage/styles. The shop must be deployed with PWA 7.32.0 or later.',
        },
      ],
    }],
  },
};
