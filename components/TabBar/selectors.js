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
} from './constants';

/**
 * Returns what tab is active, returns TAB_NONE if none is active.
 * @params {Object} state The application state.
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
 * Returns whether the tab bar is visible or not.
 * @params {Object} state The application state.
 * @returns {boolean}
 */
export const isTabBarVisible = createSelector(
  getHistoryPathname,
  hasFavorites,
  (pathname, favorites) => {
    if (
      pathname === CART_PATH ||
      pathname.startsWith(ITEM_PATH) ||
      pathname.startsWith(FILTER_PATH) ||
      pathname.startsWith(LOGIN_PATH) ||
      (pathname.startsWith(FAVORITES_PATH) && !favorites)
    ) {
      return false;
    }

    return true;
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
