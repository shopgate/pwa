/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import {
  INDEX_PATH,
  SEARCH_PATH,
  CATEGORY_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
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
    if (pathname === INDEX_PATH) {
      return TAB_HOME;
    } else if (
      pathname === BROWSE_PATH
      || pathname.startsWith(SEARCH_PATH)
      || pathname.startsWith(CATEGORY_PATH)
    ) {
      return TAB_BROWSE;
    } else if (pathname === CART_PATH) {
      return TAB_CART;
    } else if (pathname === MORE_PATH) {
      return TAB_MORE;
    }

    return TAB_NONE;
  }
);

/**
 * Returns whether the tab bar is visible or not.
 * @params {Object} state The application state.
 * @returns {boolean}
 */
export const isTabBarVisible = createSelector(
  getHistoryPathname,
  (pathname) => {
    if (
      pathname === CART_PATH ||
      pathname.startsWith(ITEM_PATH) ||
      pathname.startsWith(FILTER_PATH)
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
export const getVisibleTabs = () => ([
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
    type: TAB_MORE,
    label: 'tab_bar.more',
  },
]);
