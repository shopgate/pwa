import { i18n } from '@shopgate/engage/core';
import { generateFormFields } from '@shopgate/engage/account/helper/form';

/**
 * Generates form configuration.
 * @param {Object} params Additional parameters
 * @returns {Object}
 */
const generateFormConfig = ({ customerAttributes, isGuest }) => ({
  fields: {
    ...(!isGuest && {
      marketingOptIn: {
        type: 'checkbox',
        label: i18n.text('registration.marketing_opt_in_label'),
      },
    } : {}),
    ...generateFormFields(customerAttributes),
  },
});

export default generateFormConfig;
