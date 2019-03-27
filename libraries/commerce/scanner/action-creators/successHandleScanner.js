import { SUCCESS_HANDLE_SCANNER } from '../constants';

/**
 * Creates the dispatched SUCCESS_HANDLE_SCANNER action object.
 * @param {string} scope scan scope
 * @param {string} format data format EAN_13, QR_CODE
 * @param {Object} payload scan result
 * @returns {Object}
 */
const successHandleScanner = (scope, format, payload) => ({
  type: SUCCESS_HANDLE_SCANNER,
  scope,
  format,
  payload,
});

export default successHandleScanner;
