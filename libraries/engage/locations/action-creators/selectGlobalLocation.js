import { SELECT_GLOBAL_LOCATION } from '../constants';

/**
 * Creates the dispatched SELECT_GLOBAL_LOCATION action object.
 * @param {Object} location The location data to store for the use.
 * @returns {Object}
 */
const selectGlobalLocation = location => ({
  type: SELECT_GLOBAL_LOCATION,
  location,
});

export default selectGlobalLocation;
