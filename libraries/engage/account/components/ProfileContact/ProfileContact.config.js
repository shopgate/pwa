import { i18n } from '@shopgate/engage/core/helpers';
import { ADDRESS_TYPE_SHIPPING, ADDRESS_TYPE_BILLING } from '@shopgate/engage/checkout';

/**
 * Generates form configuration.
 * @param {Object} options Options for the helper
 * @param {Array} options.supportedCountries A list of supported countries.
 * @param {Array} options.countrySortOrder Sort order for supported countries.
 * @param {Object} options.userLocation User location for better phone picker defaults.
 * @param {boolean} options.isCheckout Whether the form is shown within the checkout process
 * @param {string} options.type An address type
 * @param {number} options.numberOfAddressLines The number of address lines
 * @returns {Object}
 */
export const generateFormConfig = ({
  supportedCountries,
  countrySortOrder,
  userLocation,
  isCheckout,
  type,
  numberOfAddressLines,
}) => ({
  fields: {
    firstName: {
      type: 'text',
      label: `${i18n.text('account.profile.form.firstName')} *`,
      required: true,
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
      required: true,
    },
    ...(!isCheckout ? {
      emailAddress: {
        type: 'email',
        label: `${i18n.text('account.profile.form.emailAddress')} *`,
        required: true,
      },
      mobile: {
        type: 'phone_picker',
        label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
        required: true,
        config: {
          supportedCountries,
          countrySortOrder,
          userLocation,
        },
      },
    } : {}),
    address1: {
      type: 'text',
      label: `${i18n.text('account.profile.form.address1')} *`,
      required: true,
    },
    ...(numberOfAddressLines >= 2 ? {
      address2: {
        type: 'text',
        label: i18n.text('account.profile.form.address2'),
      },
    } : {}),
    ...(numberOfAddressLines >= 3 ? {
      address3: {
        type: 'text',
        label: i18n.text('account.profile.form.address3'),
      },
    } : {}),
    ...(numberOfAddressLines >= 4 ? {
      address4: {
        type: 'text',
        label: i18n.text('account.profile.form.address4'),
      },
    } : {}),
    postalCode: {
      type: 'text',
      label: `${i18n.text('account.profile.form.postalCode')} *`,
      required: true,
    },
    city: {
      type: 'text',
      label: `${i18n.text('account.profile.form.city')} *`,
      required: true,
    },
    country: {
      type: 'country',
      label: `${i18n.text('account.profile.form.country')} *`,
      required: true,
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
        label: i18n.text(!isCheckout ?
          'account.profile.form.default_billing' :
          'account.profile.form.save_default_billing'),
      },
    } : {}),
    ...(!isCheckout || type === ADDRESS_TYPE_SHIPPING ? {
      isDefaultShipping: {
        type: 'checkbox',
        label: i18n.text(!isCheckout ?
          'account.profile.form.default_shipping' :
          'account.profile.form.save_default_shipping'),
      },
    } : {}),
  },
});

export default generateFormConfig;
