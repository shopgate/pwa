import {
  REQUEST_REGISTRATION,
  SUCCESS_REGISTRATION,
  ERROR_REGISTRATION,
  VALIDATION_ERRORS_REGISTRATION,
} from '../constants';

/**
 * Creates the dispatched REQUEST_REGISTRATION action object.
 * @param {Array} contacts An array of contacts for the registration
 * @param {Object} additionalData Additional data for the request.
 * @returns {Object} The dispatched action object.
 */
export const requestRegistration = (contacts, additionalData) => ({
  type: REQUEST_REGISTRATION,
  contacts,
  additionalData,
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
 * @param {Object} additionalData Additional data for the request.
 * @returns {Object} The dispatched action object.
 */
export const errorRegistration = (error, contacts, additionalData) => ({
  type: ERROR_REGISTRATION,
  error,
  contacts,
  additionalData,
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
