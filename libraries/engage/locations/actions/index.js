import { SET_LOCATIONS_PENDING } from '../constants/ActionTypes';

export { default as fetchFulfillmentSlots } from './fetchFulfillmentSlots';
export { default as fetchInventories } from './fetchInventories';
export { default as fetchLocations } from './fetchLocations';
export { default as fetchProductInventories } from './fetchProductInventories';
export { default as fetchProductLocations } from './fetchProductLocations';
export { default as submitReservation } from './submitReservation';
export { default as setUserSearchGeolocation } from './setUserSearchGeolocation';
export { default as setUserGeolocation } from './setUserGeolocation';
export { default as setDefaultLocation } from './setDefaultLocation';

/**
 * Sets pending state of locations
 * @param {boolean} value Value
 * @returns {Object}
 */
export const setPending = value => ({
  type: SET_LOCATIONS_PENDING,
  value,
});
