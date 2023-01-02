import { i18n, SHOP_SETTING_REGISTRATION_MODE_EXTENDED } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @param {Object} params Additional parameters
 * @returns {Object}
 */
const generateFormConfig = ({
  supportedCountries,
  userLocation,
  numberOfAddressLines,
  isGuest,
  isReserveOnly = false,
  registrationMode = SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
}) => ({
  fields: {
    firstName: {
      type: 'text',
      label: `${i18n.text('checkout.pickup_contact.form.firstName')} *`,
    },
    lastName: {
      type: 'text',
      label: `${i18n.text('checkout.pickup_contact.form.lastName')} *`,
    },
    ...(isGuest ? {
      emailAddress: {
        type: 'email',
        label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
      },
    } : {}),
    ...(registrationMode === SHOP_SETTING_REGISTRATION_MODE_EXTENDED ? {
      mobile: {
        type: 'phone_picker',
        label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
        config: {
          supportedCountries,
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
        },
        city: {
          type: 'text',
          label: `${i18n.text('checkout.pickup_contact.form.city')} *`,
        },
        country: {
          type: 'country',
          label: `${i18n.text('checkout.pickup_contact.form.country')} *`,
          countries: supportedCountries,
        },
        region: {
          type: 'province',
          label: `${i18n.text('checkout.pickup_contact.form.region')} *`,
          required: true,
        },
      } : {}),
    } : null),
  },
});

export default generateFormConfig;
