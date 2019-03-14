import { SCANNER_SUCCESS } from '../constants';

/**
 * Creates the dispatched SCANNER_SUCCESS action object.
 * @param {string} scope scan scope
 * @param {string} format data format EAN_13, QR_CODE
 * @param {Object} payload scan result
 * @returns {Object}
 */
export const scanSuccess = (scope, format, payload) => ({
  type: SCANNER_SUCCESS,
  scope,
  format,
  payload,
});
