import { REQUEST_SHOP_SETTINGS, RECEIVE_SHOP_SETTINGS, ERROR_SHOP_SETTINGS } from '../constants';

/**
 * Creates the dispatched REQUEST_SHOP_SETTINGS action object.
 * @param {Array} keys A list of requested shop settings - can be filtered when cached entries are
 *   not expired yet.
 * @param {Array} originalKeys An unfiltered list of keys.
 * @returns {Object} The dispatched action object.
 */
export const requestShopSettings = (keys, originalKeys) => ({
  type: REQUEST_SHOP_SETTINGS,
  keys,
  originalKeys,
});

/**
 * Creates the dispatched RECEIVE_SHOP_SETTINGS action object.
 * @param {Array} settings A list of shop settings.
 * @returns {Object} The dispatched action object.
 */
export const receiveShopSettings = settings => ({
  type: RECEIVE_SHOP_SETTINGS,
  settings,
});

/**
 * Creates the dispatched ERROR_SHOP_SETTINGS action object.
 * @param {Array} keys A list of requested shop settings - can be filtered when cached entries are
 *   not expired yet.
 * @param {Array} originalKeys An unfiltered list of keys.
 * @param {Object} error A pipeline error.
 * @returns {Object} The dispatched action object.
 */
export const errorShopSettings = (keys, originalKeys, error) => ({
  type: ERROR_SHOP_SETTINGS,
  keys,
  originalKeys,
  error,
});
