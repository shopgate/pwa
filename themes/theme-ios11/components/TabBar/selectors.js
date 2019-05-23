import { createSelector } from 'reselect';
import { getHistoryPathname } from '@shopgate/engage/core';
import { INDEX_PATH } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';
import { FAVORITES_PATH } from '@shopgate/engage/favorites';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { SEARCH_PATH } from '@shopgate/engage/search';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_NONE,
} from './constants';

/**
 * Returns a tabBar state.
 * @param {Object} state State.
 * @return {Object}
 */
const getTabBarState = state => state.ui.tabBar;

/**
 * Returns what tab is active, returns TAB_NONE if none is active.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getActiveTab = createSelector(
  getHistoryPathname,
  (pathname) => {
    switch (true) {
      case pathname === INDEX_PATH:
        return TAB_HOME;
      case (pathname === BROWSE_PATH
        || pathname.startsWith(SEARCH_PATH)
        || pathname.startsWith(CATEGORY_PATH)):
        return TAB_BROWSE;
      case pathname === CART_PATH:
        return TAB_CART;
      case pathname === MORE_PATH:
        return TAB_MORE;
      case pathname === FAVORITES_PATH:
        return TAB_FAVORITES;
      default:
        return TAB_NONE;
    }
  }
);

/**
 * Checks if the tab bar is currently enabled.
 * @return {boolean}
 */
export const isTabBarEnabled = createSelector(
  getTabBarState,
  state => state.enabled
);

/**
 * Checks if the tab bar is currently visible.
 * @return {boolean}
 */
export const isTabBarVisible = createSelector(
  getTabBarState,
  isTabBarEnabled,
  (state, enabled) => {
    if (!enabled) {
      return false;
    }

    return state.visible;
  }
);
