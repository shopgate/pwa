import sortBy from 'lodash/sortBy';
import { i18n } from '@shopgate/engage/core';

/**
 * @param {Object} attribute Customer attribute.
 * @returns {string}
 */
const mapCustomerAttributeType = (attribute) => {
  if (attribute.type === 'collectionOfValues' && attribute.values && attribute.values.length) {
    return 'select';
  }

  switch (attribute.type) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'date':
      return 'date';
    default:
      return 'text';
  }
};

/**
 * Generates form field config
 * @param {Object} customerAttributes Customer attributes.
 * @param {boolean} allowPleaseChoose Allows please choose option for required attributes.
 * @returns {Object}
 */
export const generateFormFields = (customerAttributes, allowPleaseChoose = true) => ({
  ...Object.assign({}, ...sortBy(customerAttributes, ['sequenceId']).map(attribute => ({
    [`attribute_${attribute.code}`]: {
      type: mapCustomerAttributeType(attribute),
      label: `${attribute.name} ${attribute.isRequired ? '*' : ''}`,
      ...(attribute.type === 'collectionOfValues' && attribute.values ? ({
        options: {
          // For non required property allow the user to unset it.
          ...(!attribute.isRequired ? { '': '' } : {}),
          ...(attribute.isRequired && allowPleaseChoose ? { '': i18n.text('common.please_choose') } : {}),
          // Create regular options.
          ...Object.assign({}, ...sortBy(attribute.values, ['sequenceId'])
            .map(option => ({
              [option.code]: option.name,
            }))),
        },
      }) : {}),
    },
  }))),
});

/**
 * Generates form constraints for attributes.
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const generateFormConstraints = customerAttributes => ({
  ...Object.assign({}, ...customerAttributes.map((attribute) => {
    if (!attribute.isRequired) {
      return {};
    }
    return {
      [`attribute_${attribute.code}`]: {
        presence: {
          message: 'validation.required',
          allowEmpty: false,
        },
      },
    };
  })),
});

/**
 * Maps the type of an attribute value.
 * @param {Object|string|number} value Attribute value.
 * @param {*} attribute The attribute configuration.
 * @returns {Object|string|number}
 */
const mapAttributeType = (value, attribute) => {
  if (value.code) return value;

  if (attribute.type === 'number') {
    return value.length ? parseFloat(value || 0) : null;
  }

  return value;
};

/**
 * Extracts attributes from form data as expected by the API.
 * @param {Object} customerAttributes Customer attributes.
 * @param {Object} formData  Form data.
 * @returns {Object}
 */
export const extractAttributes = (customerAttributes, formData) => customerAttributes
  .map(attribute => ({
    code: attribute.code,
    value: mapAttributeType(attribute.type === 'collectionOfValues' && attribute.values?.length
      ? [{ code: formData[`attribute_${attribute.code}`] }]
      : formData[`attribute_${attribute.code}`], attribute),
  }))
  // API does not want to have any attributes that have not yet been selected / entered.
  .filter(attribute => !Number.isNaN(attribute.value))
  .filter(attribute =>
    typeof attribute.value === 'number' ||
    attribute.value === true ||
    attribute.value === false ||
    (typeof attribute.value === 'string' && attribute.value.length) ||
    attribute.value?.[0]?.code?.length);

/**
 * Extracts the default values for the form
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const extractDefaultValues = customerAttributes => Object.assign({}, ...customerAttributes
  .map((attribute) => {
    let value = attribute.value?.[0]?.code || attribute.value?.code || attribute.value;
    if (value && value !== true && value !== false) {
      value = value.toString();
    }
    return { [`attribute_${attribute.code}`]: value };
  }));
