import {
  RECEIVE_URL,
  REQUEST_URL,
  ERROR_URL,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_URL action object.
 * @param {string} urlType The url type.
 * @param {string} url The requested url.
 * @param {number|null} [expires=null] The expires date of the url.
 * @returns {Object} The dispatched action object.
 */
export const receiveUrl = (urlType, url, expires = null) => ({
  type: RECEIVE_URL,
  url,
  urlType,
  expires,
});

/**
 * Creates the dispatched REQUEST_URL action object.
 * @param {string} urlType The url type.
 * @returns {Object} The dispatched action object.
 */
export const requestUrl = urlType => ({
  type: REQUEST_URL,
  urlType,
});

/**
 * Creates the dispatched ERROR_URL action object.
 * @param {string} urlType The url type.
 * @returns {Object} The dispatched action object.
 */
export const errorUrl = urlType => ({
  type: ERROR_URL,
  urlType,
});
