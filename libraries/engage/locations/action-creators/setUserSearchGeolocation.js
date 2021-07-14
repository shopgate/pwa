import { SET_USER_SEARCH_GEOLOCATION } from '../constants';

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {Object} geolocation The geolocation.
 * @param {string} [productId=null] An optional product code.
 * @param {boolean} [isStoreFinder=false] Was the actions dispatched for the store finder
 * @param {boolean} [silent=false] silent app propagation
 * @returns {Object}
 */
const setUserSearchGeolocation = (
  geolocation, productId = null, isStoreFinder = false, silent = false
) => ({
  type: SET_USER_SEARCH_GEOLOCATION,
  geolocation,
  productId,
  isStoreFinder,
  silent,
});

export default setUserSearchGeolocation;
