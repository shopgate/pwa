import { createSelector } from 'reselect';
import { getLoginData } from '@shopgate/pwa-common/selectors/user';

/**
 * Creates a selector that retrieves the login strategy for logged in users.
 * @returns {Function}
 */
export function makeGetLoginStrategy() {
  /**
   * Retrieves the login strategy for logged in users. If the user isn't logged in, it returns null.
   * @returns {string|null}
   */
  return createSelector(
    getLoginData,
    (login) => {
      if (!login || !login.strategy) {
        return null;
      }

      return login.strategy;
    }
  );
}
