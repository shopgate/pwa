import {
  i18n,
  SHOP_SETTING_REGISTRATION_MODE_SIMPLE,
  SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
} from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @returns {Object}
 */
const generateFormConfig = ({
  registrationMode = SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
}) => ({
  fields: {
    ...(registrationMode === SHOP_SETTING_REGISTRATION_MODE_SIMPLE ? {
      firstName: {
        type: 'text',
        label: `${i18n.text('checkout.pickup_contact.form.firstName')} *`,
      },
      lastName: {
        type: 'text',
        label: `${i18n.text('checkout.pickup_contact.form.lastName')} *`,
      },
    } : null),
    emailAddress: {
      type: 'email',
      label: `${i18n.text('checkout.pickup_contact.form.emailAddress')} *`,
    },
    password: {
      type: 'password',
      label: i18n.text('checkout.pickup_contact.form.password'),
    },
    passwordConfirm: {
      type: 'password',
      label: i18n.text('checkout.pickup_contact.form.passwordConfirm'),
    },
  },
});

export default generateFormConfig;
