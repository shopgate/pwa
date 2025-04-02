import { SELECT_LOCATION } from '../constants';

/**
 * Creates the dispatched SELECT_LOCATION action object.
 * @param {Object} location The location data to store for the use.
 * @param {boolean} showToast Whether to show a toast message.
 * @returns {Object}
 */
const selectLocation = (location, showToast) => ({
  type: SELECT_LOCATION,
  location,
  showToast,
});

export default selectLocation;
