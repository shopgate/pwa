import moment from 'moment';
import validateJs from 'validate.js';

validateJs.options = { format: 'detailed' };

validateJs.extend(validateJs.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse(value) {
    return +moment.utc(value);
  },
  // Input is a unix timestamp
  format(value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

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
