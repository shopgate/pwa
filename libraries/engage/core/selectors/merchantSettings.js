import { createSelector } from 'reselect';
import { MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED } from '../constants';

/**
 * Retrieves the shopSettings state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
const getState = state => state?.settings?.merchantSettings || {};

/**
 * Creates a selector to retrieve a single shop setting.
 * @param {string} key The key of the shop setting
 * @param {*} [fallback=null] The fallback value when no value can be determined.
 * @returns {Function}
 */
const makeGetShopSettingByKey = (key, fallback = null) => createSelector(
  getState,
  state => state?.[key] || fallback
);

export const getIsLocationBasedShopping = makeGetShopSettingByKey(
  MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED,
  false
);
