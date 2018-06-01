import {
  ENABLE_TAB_BAR,
  DISABLE_TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';

/**
 * Dispatches the ENABLE_TAB_BAR action.
 * @return {Object}
 */
export const enableTabBar = () => ({
  type: ENABLE_TAB_BAR,
});

/**
 * Dispatches the DISABLE_TAB_BAR action.
 * @return {Object}
 */
export const disableTabBar = () => ({
  type: DISABLE_TAB_BAR,
});

/**
 * Dispatches the SHOW_TAB_BAR action.
 * @return {Object}
 */
export const showTabBar = () => ({
  type: SHOW_TAB_BAR,
});

/**
 * Dispatches the HIDE_TAB_BAR action.
 * @return {Object}
 */
export const hideTabBar = () => ({
  type: HIDE_TAB_BAR,
});
