import { SET_USER_SEARCH_GEOLOCATION } from '../constants';

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {Object} geolocation The geolocation.
 * @returns {Object}
 */
const setUserSearchGeolocation = geolocation => ({
  type: SET_USER_SEARCH_GEOLOCATION,
  geolocation,
});

export default setUserSearchGeolocation;
