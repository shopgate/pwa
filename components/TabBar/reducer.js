import {
  SET_TAB_BAR_ENABLED,
  SET_TAB_BAR_VISIBLE,
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
    case SET_TAB_BAR_ENABLED:
      return {
        ...state,
        enabled: action.enabled,
      };
    case SET_TAB_BAR_VISIBLE:
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
};
