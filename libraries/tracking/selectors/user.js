import { createSelector } from 'reselect';
import {
  DEFAULT_LOGIN_STRATEGY,
  isUserLoggedIn,
  getUserData,
  makeGetLoginStrategy,
} from '@shopgate/engage/user';

/**
 * Creates a selector that retrieves user tracking data from the store.
 * @param {string} name The name of the desired parameter.
 * @returns {Function}
 */
export function makeGetUser() {
  const getLoginStrategy = makeGetLoginStrategy();

  return createSelector(
    isUserLoggedIn,
    getUserData,
    getLoginStrategy,
    (isLoggedIn, userData, loginStrategy) => {
      if (!isLoggedIn || !userData) {
        return null;
      }

      const { isFetching, loginType, ...trackedData } = userData || {};

      if (Object.keys(trackedData).length === 0) {
        return null;
      }

      let type = null;

      if (loginStrategy !== DEFAULT_LOGIN_STRATEGY) {
        type = loginStrategy;
      } else if (['userGuest', 'userAccount'].includes(loginType)) {
        type = loginType === 'userGuest' ? 'guest' : 'standard';
      }

      return {
        ...trackedData,
        type,
      };
    }
  );
}
