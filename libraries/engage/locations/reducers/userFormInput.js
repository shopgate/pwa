import { STORE_FORM_INPUT } from '../constants';
/** @typedef {import('./locations.types').UserLocationState} */

/**
 * Stores the user's reserve form input.
 * @param {UserLocationState} [state={}] The current state.
 * @param {Object} action The action object.
 * @param {string} action.type The action type.
 * @param {Object} [action.input] The input data to store.
 * @returns {UserLocationState} The new state.
 */
const formInput = (state = {}, action) => {
  switch (action.type) {
    case STORE_FORM_INPUT:
      return {
        ...state,
        ...action.input,
      };
    default:
      return state;
  }
};

export default formInput;
