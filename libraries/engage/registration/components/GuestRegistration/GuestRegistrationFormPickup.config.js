import { i18n } from '@shopgate/engage/core/helpers';

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
 * @param {Object} options Options for the helper
 * @param {Array} options.supportedCountries A list of supported countries.
 * @param {Array} options.countrySortOrder Sort order for supported countries.
 * @param {Object} options.userLocation User location for better phone picker defaults.
 * @returns {Object}
 */
const generateFormConfig = ({
  supportedCountries,
  countrySortOrder,
  userLocation,
}) => ({
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
      required: true,
    },
    lastName: {
      type: 'text',
      actions: pickupFieldActions,
      label: `${i18n.text('checkout.pickup_contact.form.lastName')} *`,
      required: true,
    },
    emailAddress: {
      type: 'email',
      actions: pickupFieldActions,
      label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
      required: true,
    },
    mobile: {
      type: 'phone_picker',
      label: `${i18n.text('checkout.pickup_contact.form.mobile')} *`,
      required: true,
      actions: pickupFieldActions,
      config: {
        supportedCountries,
        countrySortOrder,
        userLocation,
      },
    },
  },
});

export default generateFormConfig;
