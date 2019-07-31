import { SELECT_LOCATION } from '../../constants/ActionTypes';

const defaultState = {
  productCode: null,
  locationCode: null,
  addressCode: null,
  visibleStock: null,
};

/**
 * Stores the user's selected pickup location.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userLocationReducer(state = defaultState, action) {
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
