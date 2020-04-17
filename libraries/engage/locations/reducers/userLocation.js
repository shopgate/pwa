// @flow
import * as Redux from 'redux';
import {
  SELECT_LOCATION,
  STORE_FULFILLMENT_METHOD,
} from '../constants';
import { type UserLocationState } from '../locations.types';

const defaultState: UserLocationState = {
  code: null,
  name: null,
  fulfillmentMethod: null,
  productCode: null,
  visibleInventory: null,
  addressCode: null,
};

/**
 * Stores the user's selected pickup location.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userLocation(
  state: UserLocationState = defaultState,
  action: Redux.Action
): UserLocationState {
  switch (action.type) {
    case SELECT_LOCATION:
      return {
        ...state,
        ...action.location,
      };
    case STORE_FULFILLMENT_METHOD:
      return {
        ...state,
        fulfillmentMethod: action.method,
      };
    default:
      return state;
  }
}
