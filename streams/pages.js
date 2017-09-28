/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import {
  INDEX_PATH,
  PAGE_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { getPageTitle } from '../selectors/page';

/**
 * A list of all route paths that should be tracked by page view.
 * Except those that are handled individualy, like category or search.
 * @type {Array}
 */
const trackedPaths = [
  INDEX_PATH,
  PAGE_PATH,
  FILTER_PATH,
  ITEM_PATH,
  CART_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
];

// TODO: This is defined in theme-gmd, but we don't want that dependency here.
const SET_VIEW_TITLE = 'SET_VIEW_TITLE';

/**
 * Emits when page title changed.
 */
const titleChanged$ = main$
  .filter(
    ({ action, prevState, getState }) => (
      action.type === SET_VIEW_TITLE &&
      getPageTitle(prevState) !== getPageTitle(getState())
    )
  );

/**
 * Emits when a title changed for a route that should be tracked.
 */
const themTrackedPages$ = titleChanged$
  .filter(
    ({ getState }) => trackedPaths.some(
      path => (
        (path === INDEX_PATH)
          ? getHistoryPathname(getState()) === path
          : getHistoryPathname(getState()).startsWith(path)
      )
    )
  );

/**
 * Emits when a page is considered trackable.
 */
export const pagesAreReady$ = themTrackedPages$;
