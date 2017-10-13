/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'rxjs/add/operator/switchMap';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  HISTORY_PUSH_ACTION,
  HISTORY_POP_ACTION,
  HISTORY_REPLACE_ACTION,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { historyDidUpdate$ } from '@shopgate/pwa-common/streams/history';
import {
  SET_CURRENT_CATEGORY_ID,
  CATEGORY_PATH,
} from '@shopgate/pwa-common-commerce/category/constants';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  receivedRootCategories$,
  categoryRouteDidEnter$,
} from '@shopgate/pwa-common-commerce/category/streams';
import { getCurrentCategories } from '@shopgate/pwa-common-commerce/category/selectors';
import { productsReceived$ } from './product';

/**
 * Emits when the root category was entered.
 */
const rootCategoryDidEnter$ = historyDidUpdate$
  .filter(
    ({ action }) => (
      action.historyProps.pathname === CATEGORY_PATH &&
      (
        action.historyProps.action === HISTORY_PUSH_ACTION ||
        action.historyProps.action === HISTORY_POP_ACTION ||
        action.historyProps.action === HISTORY_REPLACE_ACTION
      )
    )
  );

/**
 * Emits when the root category data has been received.
 */
const rootCategoryLoaded$ = rootCategoryDidEnter$.switchMap(() => receivedRootCategories$);

/**
 * Emits when a root category's data is already available.
 */
const rootCategoryPreloaded$ = rootCategoryDidEnter$.filter(
  ({ getState }) => {
    const rootCategories = getCurrentCategories(getState());

    return rootCategories ? !!rootCategories.length : false;
  }
);

/**
 * Emits when the current category id changed.
 */
const categoryIdChanged$ = main$
  .filter(
    ({ action }) => (
      action.type === SET_CURRENT_CATEGORY_ID &&
      !!action.categoryId
    )
  );

/**
 * Emits when all necessary category data has been received.
 */
const categoryDataLoaded$ = categoryRouteDidEnter$
  .zip(productsReceived$)
  .map(([first]) => first);

/**
 * Emits when a category's data is already available.
 */
const categoryDataPreloaded$ = categoryIdChanged$
  .filter(
    ({ getState }) => (
      getProductsResult(getState()).totalProductCount !== null
    )
  );

/**
 * Emits when a category or root category is ready to be tracked,
 * considering loaded or preloaded data.
 */
export const categoryIsReady$ = categoryDataLoaded$.merge(
  categoryDataPreloaded$,
  rootCategoryLoaded$,
  rootCategoryPreloaded$
);
