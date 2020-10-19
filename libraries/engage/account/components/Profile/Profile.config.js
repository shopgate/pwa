import { i18n } from '@shopgate/engage/core';
import { generateFormFields } from '@shopgate/engage/account/helper/form';

/**
 * Generates form configuration.
 * @param {Array} customerAttributes List of customer attributes.
 * @returns {Object}
 */
const generateFormConfig = customerAttributes => ({
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
      disabled: true,
    },
    marketingOptIn: {
      type: 'checkbox',
      label: i18n.text('account.profile.form.marketing_opt_in_label'),
    },
    ...generateFormFields(customerAttributes, false),
  },
});

export default generateFormConfig;
