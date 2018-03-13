import {
  SET_VIEW_TITLE,
  SET_VIEW_TOP,
} from './constants';

const defaultState = {
  title: null,
  isTop: true,
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
    case SET_VIEW_TOP:
      return {
        ...state,
        isTop: action.isTop,
      };
    default:
      return state;
  }
};
