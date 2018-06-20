import { SET_VIEW_TITLE } from './constants';

const defaultState = {
  title: null,
};

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_VIEW_TITLE:
      return {
        ...state,
        title: action.title,
      };
    default:
      return state;
  }
};
