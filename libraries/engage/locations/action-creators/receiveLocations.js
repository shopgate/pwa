import { RECEIVE_LOCATIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_LOCATIONS action object.
 * @param {Object[]} locations locations.
 * @return {Object} The RECEIVE_LOCATIONS action.
 */
const receiveLocations = locations => ({
  type: RECEIVE_LOCATIONS,
  locations,
});

export default receiveLocations;
