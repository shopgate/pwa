import { i18n } from '@shopgate/engage/core';

const pickupFieldActions = [{
  type: 'setVisibility',
  rules: [{
    context: 'pickupPerson',
    type: 'oneOf',
    data: ['someoneElse'],
  }],
}];

/**
 * Generates form configuration.
 * @param {Object} params Additional parameters
 * @returns {Object}
 */
const generateFormConfig = ({ supportedCountries, userLocation }) => ({
  fields: {
    pickupPerson: {
      type: 'radio',
      label: i18n.text('checkout.pickup_contact.form.who_will_pickup'),
      options: {
        me: i18n.text('checkout.pickup_contact.form.me'),
        someoneElse: i18n.text('checkout.pickup_contact.form.someone_else'),
      },
    },
    firstName: {
      type: 'text',
      actions: pickupFieldActions,
      label: `${i18n.text('checkout.pickup_contact.form.firstName')} *`,
    },
    lastName: {
      type: 'text',
      actions: pickupFieldActions,
      label: `${i18n.text('checkout.pickup_contact.form.lastName')} *`,
    },
    emailAddress: {
      type: 'email',
      actions: pickupFieldActions,
      label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
    },
    mobile: {
      type: 'phone_picker',
      label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
      actions: pickupFieldActions,
      config: {
        supportedCountries,
        userLocation,
      },
    },
  },
});

export default generateFormConfig;
