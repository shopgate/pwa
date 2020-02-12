import { STORE_FORM_INPUT } from '../constants';

/**
 * Stores the user's reserve form input
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function formInput(state = {}, action) {
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
