import { RECEIVE_SHOP_SETTINGS, ERROR_SHOP_SETTINGS } from '../constants';

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
 * @param {Object} error An error object.
 * @returns {Object} The dispatched action object.
 */
export const errorShopSettings = error => ({
  type: ERROR_SHOP_SETTINGS,
  error,
});
