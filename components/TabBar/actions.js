import {
  SET_TAB_BAR_ENABLED,
  SET_TAB_BAR_VISIBLE,
} from './constants';

/**
 * Dispatches the SET_TAB_BAR_ENABLED action.
 * @param {boolean} [enabled=true] The desired state.
 * @return {Object}
 */
export const setTabBarEnabled = (enabled = true) => ({
  type: SET_TAB_BAR_ENABLED,
  enabled,
});

/**
 * Dispatches the SET_TAB_BAR_VISIBLE action.
 * @param {boolean} [visible=true] The desired state.
 * @return {Object}
 */
export const setTabBarVisible = (visible = true) => ({
  type: SET_TAB_BAR_VISIBLE,
  visible,
});
