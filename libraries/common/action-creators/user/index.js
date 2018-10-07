import {
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  ERROR_LOGIN,
  ERROR_LEGACY_CONNECT_REGISTER,
  REQUEST_LOGOUT,
  SUCCESS_LOGOUT,
  ERROR_LOGOUT,
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  TOGGLE_LOGGED_IN,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_LOGIN action object.
 * It also passes login credentials to the action,
 * in order to may access it within a stream subscription.
 * @param {string} user The user name.
 * @param {string} password The user password.
 * @param {string} strategy login strategy
 * @returns {Object} The dispatched action object.
 */
export const requestLogin = (user, password, strategy = 'basic') => ({
  type: REQUEST_LOGIN,
  user,
  password,
  strategy,
});

/**
 * Creates the dispatched RECEIVE_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
export const successLogin = () => ({
  type: SUCCESS_LOGIN,
});

/**
 * Creates the dispatched ERROR_LOGIN action object.
 * @param {Array} [messages=[]] Array of error messages.
 * @param {string} code The specific error code.
 * @returns {Object} The dispatched action object.
 */
export const errorLogin = (messages = [], code = '') => ({
  type: ERROR_LOGIN,
  messages,
  code,
});

/**
 * Creates the dispatched ERROR_LEGACY_CONNECT_REGISTER action object.
 * @returns {Object} The dispatched action object.
 */
export const errorLegacyConnectRegister = () => ({
  type: ERROR_LEGACY_CONNECT_REGISTER,
});

/**
 * Creates the dispatched REQUEST_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
export const requestLogout = () => ({
  type: REQUEST_LOGOUT,
});

/**
 * Creates the dispatched RECEIVE_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
export const successLogout = () => ({
  type: SUCCESS_LOGOUT,
});

/**
 * Creates the dispatched ERROR_LOGOUT action object.
 * @param {Array} [messages=[]] Array of error messages
 * @returns {Object} The dispatched action object.
 */
export const errorLogout = (messages = []) => ({
  type: ERROR_LOGOUT,
  messages,
});

/**
 * Creates the dispatched REQUEST_USER action object.
 * @returns {Object} The dispatched action object.
 */
export const requestUser = () => ({
  type: REQUEST_USER,
});

/**
 * Creates the dispatched RECEIVE_USER action object.
 * @param {Object} user The user data
 * @returns {Object} The dispatched action object.
 */
export const receiveUser = user => ({
  type: RECEIVE_USER,
  user,
});

/**
 * Creates the dispatched ERROR_USER action object.
 * @param {Object} error error
 @returns {Object} The dispatched action object.
 */
export const errorUser = error => ({
  type: ERROR_USER,
  error,
});

/**
 * Creates the dispatched TOGGLE_LOGGED_IN action object.
 * @param {boolean} value The updated logged in state.
 * @returns {Object} The dispatched action object.
 */
export const toggleLoggedIn = value => ({
  type: TOGGLE_LOGGED_IN,
  value,
});
