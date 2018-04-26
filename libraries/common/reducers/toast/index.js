import {
  CREATE_TOAST,
  REMOVE_TOAST,
  FLUSH_TOAST,
} from '../../constants/ActionTypes';

const defaultState = [];

/**
 * Stores all the toast messages.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_TOAST:
      return [
        ...state,
        action.options,
      ];
    case REMOVE_TOAST:
      return state.filter(toast => toast.id !== action.id);
    case FLUSH_TOAST:
      return [];
    default:
      return state;
  }
};
