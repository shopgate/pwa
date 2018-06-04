import { createSelector } from 'reselect';
import { getUrl } from './url';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getUserState = state => state.user;

/**
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getUserLogin = createSelector(
  getUserState,
  (userState) => {
    if (!userState) {
      return null;
    }

    return userState.login;
  }
);

/**
 * Selects the isLoggedIn state from the user.
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isUserLoggedIn = createSelector(
  getUserLogin,
  (login) => {
    if (!login) {
      return false;
    }

    return login.isLoggedIn;
  }
);

/**
 * Gets user.data from the redux store.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const getUserData = state => state.user.data;

/**
 * Gets the register url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getRegisterUrl = state => getUrl('register', state);
