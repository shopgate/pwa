import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @param {Array} supportedCountries A list of supported countries.
 * @param {Object} userLocation User location for better phone picker defaults.
 * @returns {Object}
 */
const generateFormConfig = (supportedCountries, userLocation) => ({
  fields: {
    firstName: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.firstName'),
    },
    lastName: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.lastName'),
    },
    company: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.company'),
    },
    address1: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.address1'),
    },
    address2: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.address2'),
    },
    city: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.city'),
    },
    region: {
      type: 'province',
      label: i18n.text('checkout.pickup_contact.form.region'),
      required: true,
    },
    country: {
      type: 'country',
      label: i18n.text('checkout.pickup_contact.form.country'),
      countries: supportedCountries,
    },
    postalCode: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.zipcode'),
    },
    mobile: {
      type: 'phone_picker',
      label: i18n.text('checkout.pickup_contact.form.cellPhone'),
      config: {
        supportedCountries,
        userLocation,
      },
    },
  },
});

export default generateFormConfig;
