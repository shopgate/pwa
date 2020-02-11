import { RECEIVE_LOCATIONS } from '../constants';

/**
 * Stores the product locations by the ID of the product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function locationsById(state = {}, action) {
  switch (action.type) {
    case RECEIVE_LOCATIONS:
      return action.locations.reduce((accumulator, location) => {
        accumulator[location.code] = {
          ...accumulator[location.code],
          isFetching: false,
          ...location,
          address: location.addresses.find(a => a.isPrimary) || location.addresses[0],
        };
        return accumulator;
      }, { ...state });

    default:
      return state;
  }
}
