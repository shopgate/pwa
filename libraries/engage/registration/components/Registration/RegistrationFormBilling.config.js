import { i18n } from '@shopgate/engage/core/helpers';

/**
 * Generates form configuration.
 * @param {Object} params Additional parameters
 * @returns {Object}
 */
const generateFormConfig = ({
  supportedCountries,
  countrySortOrder,
  userLocation,
  numberOfAddressLines,
  isGuest,
  isReserveOnly = false,
}) => ({
  fields: {
    firstName: {
      type: 'text',
      label: `${i18n.text('checkout.pickup_contact.form.firstName')} *`,
      required: true,
    },
    lastName: {
      type: 'text',
      label: `${i18n.text('checkout.pickup_contact.form.lastName')} *`,
      required: true,
    },
    ...(isGuest ? {
      emailAddress: {
        type: 'email',
        label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
        required: true,
      },
    } : {}),
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
    ...(!isGuest || (isGuest && !isReserveOnly) ? {
      companyName: {
        type: 'text',
        label: i18n.text('checkout.pickup_contact.form.company'),
      },
      address1: {
        type: 'text',
        label: `${i18n.text('checkout.pickup_contact.form.address1')} *`,
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
        label: `${i18n.text('checkout.pickup_contact.form.postalCode')} *`,
        required: true,
      },
      city: {
        type: 'text',
        label: `${i18n.text('checkout.pickup_contact.form.city')} *`,
        required: true,
      },
      country: {
        type: 'country',
        label: `${i18n.text('checkout.pickup_contact.form.country')} *`,
        countries: supportedCountries,
        required: true,
      },
      region: {
        type: 'province',
        label: `${i18n.text('checkout.pickup_contact.form.region')} *`,
        required: true,
      },
    } : {}),
  },
});

export default generateFormConfig;
