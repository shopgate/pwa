import { i18n } from '@shopgate/engage/core';
import { generateCustomerAttributesFields } from '@shopgate/engage/account/helper/form';

/**
 * Generates form configuration.
 * @param {Object} params Additional parameters
 * @returns {Object}
 */
const generateFormConfig = ({
  customerAttributes,
  isGuest,
  supportedCountries,
  userLocation,
}) => ({
  fields: {
    ...(!isGuest && {
      marketingOptIn: {
        type: 'checkbox',
        label: i18n.text('registration.marketing_opt_in_label'),
      },
    } : {}),
    ...generateCustomerAttributesFields({
      customerAttributes,
      supportedCountries,
      userLocation,
    }),
  },
});

export default generateFormConfig;
