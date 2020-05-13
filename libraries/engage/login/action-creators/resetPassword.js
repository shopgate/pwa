import { REQUEST_RESET_PASSWORD, ERROR_RESET_PASSWORD, RECEIVE_RESET_PASSWORD } from '../constants';

/**
 * Creates the dispatched REQUEST_RESET_PASSWORD action object.
 * @param {string} email The email address for the reset password request.
 * @returns {Object} The dispatched action object.
 */
export const requestResetPassword = email => ({
  type: REQUEST_RESET_PASSWORD,
  email,
});

/**
 * Creates the dispatched RECEIVE_RESET_PASSWORD action object.
 * @param {string} email The email address for the reset password request.
 * @returns {Object} The dispatched action object.
 */
export const receiveResetPassword = email => ({
  type: RECEIVE_RESET_PASSWORD,
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
