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
    emailAddress: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.emailAddress'),
    },
    mobile: {
      type: 'phone_picker',
      label: i18n.text('checkout.pickup_contact.form.cellPhone'),
      config: {
        supportedCountries,
        userLocation,
      },
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
    postalCode: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.zipcode'),
    },
    city: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.city'),
    },
    country: {
      type: 'country',
      label: i18n.text('checkout.pickup_contact.form.country'),
      countries: supportedCountries,
    },
    region: {
      type: 'province',
      label: i18n.text('checkout.pickup_contact.form.region'),
      required: true,
    },
  },
});

export default generateFormConfig;
