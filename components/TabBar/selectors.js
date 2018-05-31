import { createSelector } from 'reselect';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import {
  INDEX_PATH,
  SEARCH_PATH,
  CATEGORY_PATH,
  LOGIN_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { hasFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_NONE,
  TAB_BAR_TOGGLE_HANDLER_EXTENSION,
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
 * Checks if the TabBar visiblity is supposed to be handled by an extension. If it's like
 * that it returns the desired state. If no extension is registered as a handler,
 * the selector will return NULL.
 * @param {Object} state The application state.
 * @returns {boolean|null}
 */
export const isTabBarVisibleByExtension = createSelector(
  getTabBarState,
  (tabBarState) => {
    const {
      toggleHandler,
      shownByExtension,
    } = tabBarState;

    if (toggleHandler !== TAB_BAR_TOGGLE_HANDLER_EXTENSION) {
      return null;
    }

    return shownByExtension;
  }
);

/**
 * Returns whether the tab bar is visible or not.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isTabBarVisible = createSelector(
  isTabBarVisibleByExtension,
  getHistoryPathname,
  hasFavorites,
  (visibleByExtension, pathname, favorites) => {
    // If the visibiity state is currently handled by an extension return the desired state.
    if (visibleByExtension !== null) {
      return visibleByExtension;
    }

    // Hide the TabBar on an empty favorite list.
    if (pathname === FAVORITES_PATH && !favorites) {
      return false;
    }

    const pathsWithoutTabBar = [
      CART_PATH,
      ITEM_PATH,
      FILTER_PATH,
      LOGIN_PATH,
    ];

    // Hide the TabBar when the current path is blacklisted.
    return !pathsWithoutTabBar.find(entry => pathname.startsWith(entry));
  }
);

/**
 * Returns all visible tabs.
 * @note This is prepared to be a state, it could be fetched by a pipeline.
 * @returns {Array}
 */
export const getVisibleTabs = () => {
  const config = [
    {
      type: TAB_HOME,
      label: 'tab_bar.home',
    },
    {
      type: TAB_BROWSE,
      label: 'tab_bar.browse',
    },
    {
      type: TAB_CART,
      label: 'tab_bar.cart',
    },
    {
      type: TAB_FAVORITES,
      label: 'tab_bar.favorites',
    },
    {
      type: TAB_MORE,
      label: 'tab_bar.more',
    },
  ];
  if (!appConfig.hasFavorites) {
    config.splice(3, 1);
  }

  return config;
};
