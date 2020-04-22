import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @returns {Object}
 */
const generateFormConfig = () => ({
  fields: {
    emailAddress: {
      type: 'email',
      label: i18n.text('checkout.pickup_contact.form.emailAddress'),
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
