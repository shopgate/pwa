import { i18n } from '@shopgate/engage/core';
import { generateFormFields } from '@shopgate/engage/account/helper/form';

/**
 * Generates form configuration.
 * @param {Object} customerAttributes Customer Attributes
 * @returns {Object}
 */
const generateFormConfig = customerAttributes => ({
  fields: {
    marketingOptIn: {
      type: 'checkbox',
      label: i18n.text('registration.marketing_opt_in_label'),
    },
    ...generateFormFields(customerAttributes),
  },
});

export default generateFormConfig;
