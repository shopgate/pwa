import { i18n } from '@shopgate/engage/core';
import { ADDRESS_TYPE_SHIPPING, ADDRESS_TYPE_BILLING } from '@shopgate/engage/checkout';

/**
 * Generates form configuration.
 * @param {Array} supportedCountries A list of supported countries.
 * @param {Object} userLocation User location for better phone picker defaults.
 * @param {boolean} isCheckout Whether the form is shown within the checkout process
 * @param {string} type An address type
 * @returns {Object}
 */
export const generateFormConfig = (supportedCountries, userLocation, isCheckout, type) => ({
  fields: {
    firstName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.firstName')} *`,
    },
    ...(!isCheckout ? {
      middleName: {
        type: 'text',
        label: `${i18n.text('account.profile.form.middleName')}`,
      },
    } : {}),
    lastName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.lastName')} *`,
    },
    ...(!isCheckout ? {
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
    } : {}),
    address1: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address1')} *`,
    },
    address2: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address2')}`,
    },
    ...(!isCheckout ? {
      address3: {
        type: 'text',
        label: `${i18n.text('account.profile.form.address3')}`,
      },
      address4: {
        type: 'text',
        label: `${i18n.text('account.profile.form.address4')}`,
      },
    } : {}),
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
    ...(!isCheckout || type === ADDRESS_TYPE_BILLING ? {
      isDefaultBilling: {
        type: 'checkbox',
        label: i18n.text('account.profile.form.default_billing'),
      },
    } : {}),
    ...(!isCheckout || type === ADDRESS_TYPE_SHIPPING ? {
      isDefaultShipping: {
        type: 'checkbox',
        label: i18n.text('account.profile.form.default_shipping'),
      },
    } : {}),
  },
});

export default generateFormConfig;
