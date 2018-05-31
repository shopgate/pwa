import {
  SET_TAB_BAR_TOGGLE_HANDLER,
  TAB_BAR_TOGGLE_HANDLER_THEME,
  SHOW_TAB_BAR_BY_EXTENSION,
  HIDE_TAB_BAR_BY_EXTENSION,
} from './constants';

const defaultState = {
  shownByExtension: false,
  toggleHandler: TAB_BAR_TOGGLE_HANDLER_THEME,
};

/**
 * Stores all TabBar information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_TAB_BAR_TOGGLE_HANDLER:
      return {
        ...state,
        toggleHandler: action.handler,
      };
    case SHOW_TAB_BAR_BY_EXTENSION:
      return {
        ...state,
        shownByExtension: true,
      };
    case HIDE_TAB_BAR_BY_EXTENSION:
      return {
        ...state,
        shownByExtension: false,
      };
    default:
      return state;
  }
};
