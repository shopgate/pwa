import sortBy from 'lodash/sortBy';
import { i18n } from '@shopgate/engage/core';

/**
 * @param {Object} attribute Customer attribute.
 * @returns {string}
 */
const mapCustomerAttributeType = (attribute) => {
  if (attribute.values && attribute.values.length) {
    if (attribute.type === 'collectionOfValues') {
      return 'multiselect';
    }
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
      ...(attribute.values ? ({
        options: {
          // For non required property allow the user to unset it.
          ...(!attribute.isRequired ? { '': '' } : {}),
          ...(attribute.isRequired && attribute.type !== 'collectionOfValues' && allowPleaseChoose ? { '': i18n.text('common.please_choose') } : {}),
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
    const constraint = {};

    if (attribute.isRequired || attribute.type === 'date') {
      constraint[`attribute_${attribute.code}`] = {};
    }

    if (attribute.isRequired) {
      constraint[`attribute_${attribute.code}`].presence = {
        message: 'validation.required',
        allowEmpty: false,
      };
    }

    if (attribute.type === 'date') {
      constraint[`attribute_${attribute.code}`].datetime = {
        dateOnly: true,
        message: 'validation.date',
      };
    }

    return constraint;
  })),
});

/**
 * Maps the type of an attribute value.
 * @param {Object|string|string[]|number} value Attribute value.
 * @param {*} attribute The attribute configuration.
 * @returns {Object|string|number}
 */
const mapAttributeType = (value, attribute) => {
  // Multi select
  if (attribute.type === 'collectionOfValues') {
    return value.map(v => ({ code: v }));
  }

  // Single select.
  if (attribute.values?.length) {
    return { code: value.toString() };
  }

  // Number type.
  if (attribute.type === 'number') {
    return value.length ? parseFloat(value.replace(',', '.') || 0) : null;
  }

  // Text types (date is just a formatted text)
  if (attribute.type === 'text' || attribute.type === 'date') {
    return value !== null ? value.toString() : '';
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
    value: mapAttributeType(formData[`attribute_${attribute.code}`], attribute),
  }))
  // Removes wrong numbers (sometimes generated by the formbuilder when emptying the field)
  .filter(attribute => !Number.isNaN(attribute.value))
  // Removes all attributes that are empty / no longer set.
  .filter(attribute =>
    // Any number.
    typeof attribute.value === 'number' ||
    // Non-empty strings.
    (typeof attribute.value === 'string' && attribute.value.length) ||
    // Booleans are always allowed.
    attribute.value === true ||
    attribute.value === false ||
    // Object containing the code.
    (!Array.isArray(attribute.value?.code) && attribute.value?.code?.length) ||
    // Array containing at least one code.
    attribute.value?.[0]?.code?.length);

/**
 * Extracts the default values for the form
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const extractDefaultValues = customerAttributes => (
  Object.assign(
    {},
    ...customerAttributes.map((attribute) => {
      let { value } = attribute;

      if (value) {
        if (Array.isArray(value) && value[0] && typeof value[0] === 'object') {
          // Multi select L:95
          value = value.reduce((acc, val) => [...acc, val.code], []);
        } else if (typeof value === 'object') {
          // Single select L:100
          value = value.code;
        } else if (value !== true && value !== false) {
          value = value.toString();
        }
      }
      return { [`attribute_${attribute.code}`]: value };
    })
  )
);
