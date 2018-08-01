import { createSelector } from 'reselect';
import { getUrl } from './url';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getUserState = state => state.user;

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getUserData = createSelector(
  getUserState,
  (user) => {
    if (!user.data) {
      return null;
    }

    return user.data;
  }
);

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
 * @param {Object} state The global state.
 * @returns {string} A user name.
 */
export const getUserDisplayName = createSelector(
  getUserData,
  (data) => {
    if (!data) {
      return null;
    }

    return `${data.firstName} ${data.lastName}`;
  }
);

/**
 * Gets the register url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getRegisterUrl = state => getUrl(state, { type: 'register' });
