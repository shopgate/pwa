import { i18n } from '@shopgate/engage/core';
import sortBy from 'lodash/sortBy';

/**
 * @param {Object} attribute Customer attribute.
 * @returns {string}
 */
const mapCustomerAttributeType = (attribute) => {
  if (attribute.values && attribute.values.length) {
    return 'select';
  }

  switch (attribute.type) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    default:
      return 'text';
  }
};

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
    },
    marketingOptIn: {
      type: 'checkbox',
      label: i18n.text('account.profile.form.marketing_opt_in_label'),
    },
    ...Object.assign({}, ...sortBy(customerAttributes, ['sequenceId']).map(attribute => ({
      [`attribute_${attribute.code}`]: {
        type: mapCustomerAttributeType(attribute),
        label: `${attribute.name} ${attribute.isRequired ? '*' : ''}`,
        ...(attribute.values ? ({
          options: {
            // For non required property allow the user to unset it.
            ...(!attribute.isRequired ? { '': '' } : {}),
            // Create regular options.
            ...Object.assign({}, ...sortBy(attribute.values, ['sequenceId'])
              .map(option => ({
                [option.code]: option.name,
              }))),
          },
        }) : {}),
      },
    }))),
  },
});

export default generateFormConfig;
