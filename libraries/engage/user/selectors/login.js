import { createSelector, setGlobalDevModeChecks } from 'reselect';
import { getLoginData } from '@shopgate/pwa-common/selectors/user';

// In Reselect v5, dev-mode checks call input selectors multiple times.
// In unit tests (where input selectors are often mocked with `mockReturnValueOnce`),
// this can cause noisy warnings/failures unrelated to the memoization behavior we want to test.
if (process.env.NODE_ENV === 'test') {
  setGlobalDevModeChecks({
    inputStabilityCheck: 'never',
    identityFunctionCheck: 'never',
  });
}

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
