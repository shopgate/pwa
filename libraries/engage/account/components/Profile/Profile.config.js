import { i18n } from '@shopgate/engage/core';

/**
 * Generates form configuration.
 * @returns {Object}
 */
const generateFormConfig = () => ({
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
    marketingOptIn: {
      type: 'checkbox',
      label: i18n.text('account.profile.form.marketing_opt_in_label'),
    },
  },
});

export default generateFormConfig;
