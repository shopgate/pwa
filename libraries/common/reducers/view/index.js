import {
  DECREMENT_VIEW_LOADING,
  INCREMENT_VIEW_LOADING,
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
} from '../../constants/ActionTypes';

const defaultState = {
  isLoading: {},
};

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function viewReducer(state = defaultState, action) {
  switch (action.type) {
    case DECREMENT_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: Math.max(0, state.isLoading[action.pathname] - 1),
        },
      };
    case INCREMENT_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: state.isLoading[action.pathname] + 1,
        },
      };
    case SET_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: 1,
        },
      };
    case UNSET_VIEW_LOADING: {
      const { [action.pathname]: exclude, ...views } = state.isLoading;

      return {
        ...state,
        isLoading: views,
      };
    }
    default:
      return state;
  }
}
