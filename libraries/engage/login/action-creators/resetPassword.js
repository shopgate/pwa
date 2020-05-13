import { RESET_PASSWORD, ERROR_RESET_PASSWORD, SUCCESS_RESET_PASSWORD } from '../constants';

/**
 * Creates the dispatched RESET_PASSWORD action object.
 * @param {string} email The email address for the reset password request.
 * @returns {Object} The dispatched action object.
 */
export const resetPassword = email => ({
  type: RESET_PASSWORD,
  email,
});

/**
 * Creates the dispatched SUCCESS_RESET_PASSWORD action object.
 * @param {string} email The email address for the reset password request.
 * @returns {Object} The dispatched action object.
 */
export const successResetPassword = email => ({
  type: SUCCESS_RESET_PASSWORD,
  email,
});

/**
 * Creates the dispatched ERROR_RESET_PASSWORD action object.
 * @param {string} email The email address for the reset password request.
 * @param {Object} error A pipeline error.
 * @returns {Object} The dispatched action object.
 */
export const errorResetPassword = (email, error) => ({
  type: ERROR_RESET_PASSWORD,
  email,
  error,
});
