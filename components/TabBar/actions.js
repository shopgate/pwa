import {
  SET_TAB_BAR_TOGGLE_HANDLER,
  TAB_BAR_TOGGLE_HANDLER_THEME,
  SHOW_TAB_BAR_BY_EXTENSION,
  HIDE_TAB_BAR_BY_EXTENSION,
} from './constants';

/**
 * Dispatches the SHOW_TAB_BAR_BY_EXTENSION action.
 * @return {Object}
 */
export const showTabBarByExtension = () => ({
  type: SHOW_TAB_BAR_BY_EXTENSION,
});

/**
 * Dispatches the HIDE_TAB_BAR_BY_EXTENSION action.
 * @return {Object}
 */
export const hideTabBarByExtension = () => ({
  type: HIDE_TAB_BAR_BY_EXTENSION,
});

/**
 * Dispatches the SET_TAB_BAR_TOGGLE_HANDLER action.
 * @param {string} [handler=TAB_BAR_TOGGLE_HANDLER_THEME] The handler to be set.
 * @return {Object}
 */
export const setTabBarToggleHandler = (handler = TAB_BAR_TOGGLE_HANDLER_THEME) => ({
  type: SET_TAB_BAR_TOGGLE_HANDLER,
  handler,
});
