import {
  REQUEST_REGISTRATION,
  SUCCESS_REGISTRATION,
  ERROR_REGISTRATION,
  VALIDATION_ERRORS_REGISTRATION,
} from '../constants';

/**
 * Creates the dispatched REQUEST_REGISTRATION action object.
 * @param {Array} contacts An array of contacts for the registration
 * @returns {Object} The dispatched action object.
 */
export const requestRegistration = contacts => ({
  type: REQUEST_REGISTRATION,
  contacts,
});

/**
 * Creates the dispatched SUCCESS_REGISTRATION action object.
 * @param {Object} response The pipeline response object
 * @returns {Object} The dispatched action object.
 */
export const successRegistration = response => ({
  type: SUCCESS_REGISTRATION,
  response,
});

/**
 * Creates the dispatched ERROR_REGISTRATION action object.
 * @param {Error} error An error object
 * @param {Array} contacts An array of contacts for the registration
 * @returns {Object} The dispatched action object.
 */
export const errorRegistration = (error, contacts) => ({
  type: ERROR_REGISTRATION,
  error,
  contacts,
});

/**
 * Creates the dispatched VALIDATION_ERRORS_REGISTRATION action object.
 * @param {Array} errors An array of validation errors
 * @returns {Object} The dispatched action object.
 */
export const validationErrorsRegistration = errors => ({
  type: VALIDATION_ERRORS_REGISTRATION,
  errors,
});
