import { SELECT_LOCATION } from '../constants';

const defaultState = {
  code: null,
  name: null,
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
export default function userLocation(state = defaultState, action) {
  switch (action.type) {
    case SELECT_LOCATION:
      return {
        ...state,
        ...action.location,
      };
    default:
      return state;
  }
}
