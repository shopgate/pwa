import { CREATE_MODAL, REMOVE_MODAL } from '../../constants/ActionTypes';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function modalReducer(state = [], action) {
  switch (action.type) {
    case CREATE_MODAL:
      return [
        ...state,
        action.options,
      ];
    case REMOVE_MODAL:
      return state.filter(modal => modal.id !== action.id);
    default:
      return state;
  }
}
