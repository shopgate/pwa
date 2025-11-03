import { SET_USER_SEARCH_COUNTRY_CODE } from '../constants';

/**
 * @typedef {Object} SetUserSearchCountryCodeActionType
 * @property {string} type The action type.
 * @property {string} countryCode The country code.
 * @property {string|null} productId The product ID.
 * @property {boolean} isStoreFinder Indicates if the action was dispatched for the store finder.
 */

/**
 * Creates the dispatched SET_USER_SEARCH_COUNTRY_CODE action object.
 * @param {string} countryCode The country code.
 * @param {string|null} [productId=null] An optional product code.
 * @param {boolean} [isStoreFinder=false]
 * Indicates if the action was dispatched for the store finder.
 * @returns {SetUserSearchCountryCodeActionType} The action object.
 */
const setUserSearchCountryCode = (countryCode, productId = null, isStoreFinder = false) => ({
  type: SET_USER_SEARCH_COUNTRY_CODE,
  countryCode,
  productId,
  isStoreFinder,
});

export default setUserSearchCountryCode;
