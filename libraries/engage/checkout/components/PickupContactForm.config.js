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
    instructions: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.instructions'),
      placeholder: i18n.text('checkout.pickup_contact.form.instructionsPlaceholder'),
    },
    cellPhone: {
      type: 'phone_picker',
      label: i18n.text('checkout.pickup_contact.form.cellPhone'),
      config: {
        supportedCountries,
        userLocation,
      },
    },
    pickupPerson: {
      type: 'radio',
      label: i18n.text('checkout.pickup_contact.form.who_will_pickup'),
      options: {
        me: i18n.text('checkout.pickup_contact.form.me'),
        someoneElse: i18n.text('checkout.pickup_contact.form.someone_else'),
      },
    },
    pickupFirstName: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.firstName'),
      visible: false,
      actions: pickupFieldActions,
    },
    pickupLastName: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.lastName'),
      visible: false,
      actions: pickupFieldActions,
    },
    pickupCellPhone: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.cellPhone'),
      visible: false,
      actions: pickupFieldActions,
    },
    pickupEmailAddress: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.emailAddress'),
      visible: false,
      actions: pickupFieldActions,
    },
  },
});

export default generateFormConfig;
