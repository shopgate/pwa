import { ERROR_HANDLE_SCANNER } from '../constants';

/**
 * Creates the dispatched ERROR_HANDLE_SCANNER action object.
 * @param {string} scope scan scope
 * @param {string} format data format EAN_13, QR_CODE
 * @param {Object} payload scan result
 * @returns {Object}
 */
const errorHandleScanner = (scope, format, payload) => ({
  type: ERROR_HANDLE_SCANNER,
  scope,
  format,
  payload,
});

export default errorHandleScanner;
