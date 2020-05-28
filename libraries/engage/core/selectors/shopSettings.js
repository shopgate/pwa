import { createSelector } from 'reselect';

/**
 * Retrieves the shopSettings state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
export const getState = state => state?.settings?.shopSettings || {};

/**
 * Creates a selector to retrieve a single shop setting.
 * @param {string} key The key of the shop setting
 * @param {*} [fallback=null] The fallback value when no value can be determined.
 * @returns {Function}
 */
export const makeGetShopSettingByKey = (key, fallback = null) => createSelector(
  getState,
  state => state?.[key] || fallback
);

/**
 * Creates a selector to retrieve multiple shop setting.
 * @param {Array} [keys=[]] Optional keys to filter.
 * @returns {Function}
 */
export const makeGetShopSettings = (keys = []) => createSelector(
  getState,
  (state) => {
    const result = Object.keys(state).filter((key) => {
      if (Array.isArray(keys) && keys.length > 0) {
        return keys.includes(key);
      }

      return true;
    }).reduce((acc, key) => {
      if (state?.[key]) {
        acc[key] = state[key];
      }

      return acc;
    }, {});

    return result;
  }
);
