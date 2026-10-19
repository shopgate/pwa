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
  DISABLE_LOGIN,
} from '../../constants/ActionTypes';

import { DEFAULT_LOGIN_STRATEGY } from '../../constants/user';

/**
 * Creates the dispatched REQUEST_LOGIN action object.
 * It also passes login credentials to the action,
 * in order to may access it within a stream subscription.
 * @param {string} user The user name.
 * @param {string} password The user password.
 * @param {string} strategy login strategy
 * @returns {Object} The dispatched action object.
 */
export const requestLogin = (user, password, strategy = DEFAULT_LOGIN_STRATEGY) => ({
  type: REQUEST_LOGIN,
  user,
  password,
  strategy,
});

/**
 * Creates the dispatched RECEIVE_LOGIN action object.
 * @param {Object|boolean} [redirect] The redirect params. When set to `false` the user stays on
 * the current page.
 * @param {string} strategy The login strategy.
 * @param {number} [sessionLifetimeInSeconds] The session lifetime in seconds
 * @param {Object} [options] Further details of the login.
 * @param {string} [options.source] What the login came from when it wasn't the login form, e.g.
 * `LOGIN_SOURCE_BIOMETRIC` of `@shopgate/engage/login/constants`. Subscriptions can use it to
 * react differently, e.g. to skip a confirmation.
 * @returns {Object} The dispatched action object.
 */
export const successLogin = (
  redirect,
  strategy = DEFAULT_LOGIN_STRATEGY,
  sessionLifetimeInSeconds = undefined,
  { source } = {}
) => ({
  type: SUCCESS_LOGIN,
  redirect,
  strategy,
  sessionLifetimeInSeconds,
  source,
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
 * @param {boolean} [notify=true] If set to TRUE users are notified when the logout was successful.
 * @param {boolean} [autoLogout=false] Whether the logout happened because e.g. session expired
 * @returns {Object} The dispatched action object.
 */
export const successLogout = (notify = true, autoLogout = false) => ({
  type: SUCCESS_LOGOUT,
  notify,
  autoLogout,
});

/**
 * Creates the dispatched ERROR_LOGOUT action object.
 * @param {Array} [messages=[]] Array of error messages
 * @param {boolean} [autoLogout=false] Whether the logout happened because e.g. session expired
 * @returns {Object} The dispatched action object.
 */
export const errorLogout = (messages = [], autoLogout = false) => ({
  type: ERROR_LOGOUT,
  messages,
  autoLogout,
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

/**
 * Creates the dispatched DISABLE_LOGIN action object.
 * @param {boolean} value Whether it is enabled or disabled.
 * @returns {Object}
 */
export const disableLogin = value => ({
  type: DISABLE_LOGIN,
  value,
});
