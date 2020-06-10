import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @param {Array} supportedCountries A list of supported countries.
 * @param {Object} userLocation User location for better phone picker defaults.
 * @returns {Object}
 */
const generateFormConfig = (supportedCountries, userLocation) => ({
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
        userLocation,
      },
    },
  },
});

export default generateFormConfig;
