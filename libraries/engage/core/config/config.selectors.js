// @flow
import { createSelector, type Selector } from 'reselect';
import { type ConfigState, type MerchantSettings } from './config.types';

/**
 * Retrieves the config state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
function getState(state): ConfigState {
  return state.config || {};
}

/**
 * Creates the selector that retrieves the config.
 * @returns {Function}
 */
export function makeGetConfig(): Selector<any, ConfigState> {
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
export function makeGetMerchantSettings(): Selector<any, MerchantSettings> {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return createSelector(
    getState,
    state => state.merchantSettings || {}
  );
}
