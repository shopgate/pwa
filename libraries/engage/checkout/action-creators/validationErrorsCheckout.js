import { VALIDATION_ERRORS_CHECKOUT } from '../constants/actionTypes';

/**
 * Creates the dispatched VALIDATION_ERRORS_CHECKOUT action object.
 * @param {Array} errors An array of validation errors
 * @returns {Object} The dispatched action object.
 */
export const validationErrorsCheckout = errors => ({
  type: VALIDATION_ERRORS_CHECKOUT,
  errors,
});
