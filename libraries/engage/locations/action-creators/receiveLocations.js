import { RECEIVE_LOCATIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_LOCATIONS action object.
 * @param {Object[]} filters filters.
 * @param {Object[]} locations locations.
 * @return {Object} The RECEIVE_LOCATIONS action.
 */
const receiveLocations = (filters, locations) => ({
  type: RECEIVE_LOCATIONS,
  locations,
  filters,
});

export default receiveLocations;
