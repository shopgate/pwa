import { SELECT_LOCATION } from '../constants';

/**
 * Creates the dispatched SELECT_LOCATION action object.
 * @param {Object} location The location data to store for the use.
 * @returns {Object}
 */
const selectLocation = location => ({
  type: SELECT_LOCATION,
  location,
});

export default selectLocation;
