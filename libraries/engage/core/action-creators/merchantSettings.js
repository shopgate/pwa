import { RECEIVE_MERCHANT_SETTINGS } from '../constants';

/**
 * Creates the dispatched RECEIVE_MERCHANT_SETTINGS action object.
 * @param {Array} settings A list of shop settings.
 * @returns {Object} The dispatched action object.
 */
export const receiveMerchantSettings = settings => ({
  type: RECEIVE_MERCHANT_SETTINGS,
  settings,
});
