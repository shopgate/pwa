import {
  ENABLE_TAB_BAR,
  DISABLE_TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';

const defaultState = {
  enabled: true,
  visible: true,
};

/**
 * Stores all TabBar information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case ENABLE_TAB_BAR:
      return {
        ...state,
        enabled: true,
      };
    case DISABLE_TAB_BAR:
      return {
        ...state,
        enabled: false,
      };
    case SHOW_TAB_BAR:
      return {
        ...state,
        visible: true,
      };
    case HIDE_TAB_BAR:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};
