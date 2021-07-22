import { SET_USER_GEOLOCATION } from '../constants';

/**
 * @param {Object} geolocation .
 * @param {boolean} silent .
 * @returns {Object}
 */
const setUserGeolocation = (geolocation, silent) => ({
  type: SET_USER_GEOLOCATION,
  geolocation,
  silent,
});

export default setUserGeolocation;
