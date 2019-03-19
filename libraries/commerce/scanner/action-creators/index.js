import { SCANNER_FINISHED } from '../constants';

/**
 * Creates the dispatched SCANNER_FINISHED action object.
 * @param {string} scope scan scope
 * @param {string} format data format EAN_13, QR_CODE
 * @param {Object} payload scan result
 * @returns {Object}
 */
export const scannerFinished = (scope, format, payload) => ({
  type: SCANNER_FINISHED,
  scope,
  format,
  payload,
});
