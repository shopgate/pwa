import { CREATE_TOAST, REMOVE_TOAST } from '../../constants/ActionTypes';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = [], action) => {
  switch (action.type) {
    case CREATE_TOAST:
      return [
        ...state,
        action.options,
      ];
    case REMOVE_TOAST:
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
};
