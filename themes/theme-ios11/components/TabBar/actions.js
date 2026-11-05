import {
  ENABLE_TAB_BAR,
  DISABLE_TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
  SET_TAB_LAST_ROUTE,
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

/**
 * Remembers the last route that was shown within a tab.
 * @param {string} tab The tab.
 * @param {Object} route The route.
 * @param {string} route.pathname The pathname of the route.
 * @param {string} route.pattern The pattern of the route.
 * @param {Object} [route.state] The state of the route.
 * @return {Object}
 */
export const setTabLastRoute = (tab, { pathname, pattern, state }) => ({
  type: SET_TAB_LAST_ROUTE,
  tab,
  route: {
    pathname,
    pattern,
    state,
  },
});
