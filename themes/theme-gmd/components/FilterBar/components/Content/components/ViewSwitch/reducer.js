import {
  GRID_VIEW,
  SET_CATEGORY_VIEW_MODE,
} from './constants';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = {
  viewMode: GRID_VIEW,
}, action) => {
  switch (action.type) {
    case SET_CATEGORY_VIEW_MODE:
      return {
        ...state,
        viewMode: action.viewMode,
      };
    default:
      return state;
  }
};
