// @flow
import * as Redux from 'redux';
import { RECEIVE_LOCATIONS } from '../constants';
import { type LocationsByIdState } from '../locations.types';

/**
 * Stores the product locations by the location code.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function locationsById(
  state: LocationsByIdState = {},
  action: Redux.Action
): LocationsByIdState {
  switch (action.type) {
    case RECEIVE_LOCATIONS:
      return action.locations.reduce((accumulator, location) => {
        accumulator[location.code] = {
          ...accumulator[location.code],
          ...location,
          address: location.addresses.find(a => a.isPrimary) || location.addresses[0],
        };
        return accumulator;
      }, { ...state });

    default:
      return state;
  }
}
