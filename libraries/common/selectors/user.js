import { getUrl } from './url';

/**
 * Selects the isLoggedIn state from the user.
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isUserLoggedIn = state => state.user.login.isLoggedIn;

/**
 * Gets user.data from the redux store.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const getUserData = state => state.user.data;

/**
 * Gets user.login from the redux store.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const getLoginData = state => state.user.login;

/**
 * Selects the isFetching state of the login action from the redux store.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const isUserLoginDisabled = state => getLoginData(state).disabled;

/**
 * Gets the register url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getRegisterUrl = state => getUrl('register', state);
