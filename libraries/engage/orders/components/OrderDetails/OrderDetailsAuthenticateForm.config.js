import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @param {Object} options Options for the helper
 * @param {Array} options.supportedCountries A list of supported countries.
 * @param {Array} options.countrySortOrder Sort order for supported countries.
 * @param {Object} options.userLocation User location for better phone picker defaults.
 * @returns {Object}
 */
const generateFormConfig = ({
  supportedCountries,
  countrySortOrder,
  userLocation,
}) => ({
  fields: {
    email: {
      type: 'email',
      label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
    },
    phone: {
      type: 'phone_picker',
      label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
      config: {
        supportedCountries,
        countrySortOrder,
        userLocation,
      },
    },
  },
});

export default generateFormConfig;
