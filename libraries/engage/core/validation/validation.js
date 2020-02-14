import validateJs from 'validate.js';

validateJs.options = { format: 'detailed' };

/**
 * @param {Object} values The values to validate.
 * @param {Object} constraints The constraints.
 * @returns {{ valid: boolean, validationErrors: Object }}
 */
export function validate(values, constraints) {
  let errors = validateJs(values, constraints);

  if (errors && Object.keys(errors).length > 0) {
    errors = errors.reduce((obj, item) => {
      if (obj[item.attribute]) {
        return obj;
      }
      return {
        ...obj,
        [item.attribute]: item.options.message,
      };
    }, {});
  }

  return {
    valid: !errors,
    validationErrors: errors,
  };
}
