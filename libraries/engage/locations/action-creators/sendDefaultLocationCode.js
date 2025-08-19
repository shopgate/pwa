import {
  SEND_SET_DEFAULT_LOCATION_CODE_REQUEST,
  SEND_SET_DEFAULT_LOCATION_CODE_ERROR,
  SEND_SET_DEFAULT_LOCATION_CODE_SUCCESS,
} from '../constants';

/**
 * Creates the dispatched SEND_SET_DEFAULT_LOCATION_CODE_REQUEST action object.
 * @param {number} locationCode The sent location code
 * @returns {Object}
 */
export const sendSetDefaultLocationCodeRequest = locationCode => ({
  type: SEND_SET_DEFAULT_LOCATION_CODE_REQUEST,
  locationCode,
});

/**
 * Creates the dispatched SEND_SET_DEFAULT_LOCATION_CODE_SUCCESS action object.
 * @param {number} locationCode The sent location code
 * @returns {Object}
 */
export const sendSetDefaultLocationCodeSuccess = locationCode => ({
  type: SEND_SET_DEFAULT_LOCATION_CODE_SUCCESS,
  locationCode,
});

/**
 * Creates the dispatched SEND_SET_DEFAULT_LOCATION_CODE_ERROR action object.
 * @param {number} locationCode The sent location code
 * @param {string} errorCode The error code
 * @returns {Object}
 */
export const sendSetDefaultLocationCodeError = (locationCode, errorCode) => ({
  type: SEND_SET_DEFAULT_LOCATION_CODE_ERROR,
  locationCode,
  errorCode,
});

