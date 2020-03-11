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

/**
 * Creates a selector that retrieves the enabled fulfillment paths from the merchant settings.
 * @returns {Function}
 */
export function makeGetEnabledFulfillmentMethods(): Selector<any, string[]> {
  const getMerchantSettings = makeGetMerchantSettings();

  return createSelector(
    getMerchantSettings,
    (settings) => {
      if (!settings.enabledFulfillmentMethods) {
        return [];
      }

      return settings.enabledFulfillmentMethods;
    }
  );
}

/**
 * Creates a selector that retrieves the enabled fulfillment paths.
 * @returns {Function}
 */
export function makeGetFulfillmentPaths(): Selector<any, string[]> {
  const getMerchantSettings = makeGetMerchantSettings();

  return createSelector(
    getMerchantSettings,
    (settings): string[] => {
      if (!settings || Object.keys(settings).length === 0) {
        return [];
      }

      const { enabledFulfillmentMethodSelectionForEngage = [] } = settings;
      return enabledFulfillmentMethodSelectionForEngage;
    }
  );
}
