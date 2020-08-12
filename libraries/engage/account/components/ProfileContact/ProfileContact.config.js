import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @param {Array} supportedCountries A list of supported countries.
 * @param {Object} userLocation User location for better phone picker defaults.
 * @returns {Object}
 */
export const generateFormConfig = (supportedCountries, userLocation) => ({
  fields: {
    firstName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.firstName')} *`,
    },
    middleName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.middleName')}`,
    },
    lastName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.lastName')} *`,
    },
    emailAddress: {
      type: 'email',
      label: `${i18n.text('account.profile.form.emailAddress')} *`,
    },
    mobile: {
      type: 'phone_picker',
      label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
      config: {
        supportedCountries,
        userLocation,
      },
    },
    address1: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address1')} *`,
    },
    address2: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address2')}`,
    },
    address3: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address3')}`,
    },
    address4: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address4')}`,
    },
    postalCode: {
      type: 'text',
      label: `${i18n.text('account.profile.form.postalCode')} *`,
    },
    city: {
      type: 'text',
      label: `${i18n.text('account.profile.form.city')} *`,
    },
    country: {
      type: 'country',
      label: `${i18n.text('account.profile.form.country')} *`,
      countries: supportedCountries,
    },
    region: {
      type: 'province',
      label: `${i18n.text('account.profile.form.region')} *`,
      required: true,
    },
    isDefaultBilling: {
      type: 'checkbox',
      label: i18n.text('account.profile.form.default_billing'),
    },
    isDefaultShipping: {
      type: 'checkbox',
      label: i18n.text('account.profile.form.default_shipping'),
    },
  },
});

export default generateFormConfig;
