import { SET_LOCATIONS_PENDING } from '../constants/ActionTypes';

export { default as fetchLocations } from './fetchLocations';
export { default as fetchProductLocations } from './fetchProductLocations';
export { default as submitReservation } from './submitReservation';
export { default as setUserSearchGeolocation } from './setUserSearchGeolocation';

/**
 * Sets pending state of locations
 * @param {boolean} value Value
 * @returns {Object}
 */
export const setPending = value => ({
  type: SET_LOCATIONS_PENDING,
  value,
});
