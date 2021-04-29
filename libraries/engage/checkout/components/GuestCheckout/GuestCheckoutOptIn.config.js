import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @returns {Object}
 */
const generateFormConfig = () => ({
  fields: {
    marketingOptIn: {
      type: 'checkbox',
      label: i18n.text('registration.marketing_opt_in_label'),
    },
  },
});

export default generateFormConfig;
