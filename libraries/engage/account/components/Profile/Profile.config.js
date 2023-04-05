import { i18n } from '@shopgate/engage/core';
import { generateCustomerAttributesFields } from '@shopgate/engage/account/helper/form';

/**
 * Generates form configuration.
 * @param {Object} additionalOptions Options for the customer attributes creation helper
 * @param {Array} additionalOptions.customerAttributes Customer attributes.
 * @param {Array} additionalOptions.supportedCountries A list of supported countries.
 * @param {Array} additionalOptions.countrySortOrder Sort order for supported countries.
 * @param {Object} additionalOptions.userLocation User location for better phone picker defaults.
 * @param {boolean} [additionalOptions.allowPleaseChoose] Allows please choose option for required
 * attributes.
 * @returns {Object}
 */
const generateFormConfig = additionalOptions => ({
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
    ...generateCustomerAttributesFields(additionalOptions, false),
  },
});

export default generateFormConfig;
