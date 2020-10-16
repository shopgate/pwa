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
 * Generates form field config
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const generateFormFields = customerAttributes => ({
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
 * Extracts attributes from form data as expected by the API.
 * @param {Object} customerAttributes Customer attributes.
 * @param {Object} formData  Form data.
 * @returns {Object}
 */
export const extractAttributes = (customerAttributes, formData) => customerAttributes
  .map(attribute => ({
    code: attribute.code,
    value: attribute.values?.length
      ? { code: formData[`attribute_${attribute.code}`] }
      : formData[`attribute_${attribute.code}`],
  }))
  // API does not want to have any attributes that have not yet been selected / entered.
  .filter(attribute =>
    attribute.value === true ||
    attribute.value === false ||
    attribute.value.length ||
    attribute.value?.code?.length);
