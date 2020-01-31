import { combineReducers } from 'redux';
import { SELECT_LOCATION, STORE_FORM_INPUT } from '../../constants/ActionTypes';

const defaultLocationState = {
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
function locationData(state = defaultLocationState, action) {
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

/**
 * Stores the user's reserve form input
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
function formInput(state = {}, action) {
  switch (action.type) {
    case STORE_FORM_INPUT:
      return {
        ...state,
        ...action.input,
      };
    default:
      return state;
  }
}

export default combineReducers({
  data: locationData,
  formInput,
});
