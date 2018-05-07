import {
  CREATE_TOAST,
  REMOVE_TOAST,
  DISMISS_TOASTS,
  UNBLOCK_TOASTS,
} from '../../constants/ActionTypes';

const defaultState = {
  dismissed: false,
  toasts: [],
};

/**
 * Stores all the toast messages.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_TOAST:
      if (state.dismissed) {
        return state;
      }
      return {
        ...state,
        toasts: [...state.toasts, action.options],
      };
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.id),
      };
    case DISMISS_TOASTS:
      return {
        ...state,
        dismissed: true,
        toasts: [],
      };
    case UNBLOCK_TOASTS:
      return {
        ...state,
        dismissed: false,
      };
    default:
      return state;
  }
};
