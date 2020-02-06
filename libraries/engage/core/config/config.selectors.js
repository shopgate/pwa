import { createSelector } from 'reselect';

/**
 * Retrieves the config state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
function getState(state) {
  return state.config || {};
}

/**
 * Creates the selector that retrieves the config.
 * @returns {Function}
 */
export function makeGetConfig() {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return createSelector(
    getState,
    state => state
  );
}

/**
 * Creates the selector that retrieves the merchant settings.
 * @returns {Function}
 */
export function makeGetMerchantSettings() {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return createSelector(
    getState,
    state => state.merchantSettings || {}
  );
}
