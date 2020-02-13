import { validationRules as validators } from './validation.rules';
import { validationErrors } from './validation.constants';

/**
 * @param {Object} values The values to validate.
 * @param {Object} validationRules The rules.
 * @returns {{ valid: boolean, validationErrors: Object }}
 */
export function validate(values, validationRules) {
  const errors = Object.keys(values).reduce((acc, field) => {
    if (!validationRules[field]) {
      // No rule for a field
      return acc;
    }

    const failedRule = [].concat(validationRules[field]).find((rule) => {
      if (!validators[rule]) {
        return false;
      }
      return !validators[rule](values[field]);
    });

    if (failedRule) {
      acc[field] = validationErrors[failedRule];
    }
    return acc;
  }, {});

  return {
    valid: Object.keys(errors).length === 0,
    validationErrors: errors,
  };
}
