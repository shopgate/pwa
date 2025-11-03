import { SET_USER_SEARCH_POSTAL_CODE } from '../constants';

/**
 * @typedef {Object} SetUserSearchPostalCodeActionType
 * @property {string} type The action type.
 * @property {string|null} postalCode The postal code.
 * @property {string|null} productId The product ID.
 * @property {boolean} isStoreFinder Indicates if the action was dispatched for the store finder.
 */

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {string|null} postalCode The postal code.
 * @param {string|null} [productId=null] An optional product code.
 * @param {boolean} [isStoreFinder=false]
 * Indicates if the action was dispatched for the store finder.
 * @returns {SetUserSearchPostalCodeActionType} The action object.
 */
const setUserSearchPostalCode = (postalCode, productId = null, isStoreFinder = false) => ({
  type: SET_USER_SEARCH_POSTAL_CODE,
  postalCode,
  productId,
  isStoreFinder,
});

export default setUserSearchPostalCode;
