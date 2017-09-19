/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  SET_CURRENT_CATEGORY_ID,
  RECEIVE_CATEGORY_CHILDREN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { productsReceived$ } from './product';

/**
 * Emits when the current category id changed.
 */
const categoryIdChanged$ = main$
  .filter(
    ({ action }) => (
      // TODO: Root category needs to be considered.
      // TODO: Category route as entry point needs to be considered.
      action.type === SET_CURRENT_CATEGORY_ID &&
      !!action.categoryId
    )
  );

/**
 * Emits when specific category data has been received.
 */
const childrenReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_CATEGORY_CHILDREN);

/**
 * Emits when all necessary category data has been received.
 */
const dataLoaded$ = categoryIdChanged$
  .zip(productsReceived$, childrenReceived$)
  .map(([first]) => first);

/**
 * Emits when a category's data is already available.
 */
const dataPreloaded$ = categoryIdChanged$
  .filter(
    ({ getState }) => (
      getProductsResult(getState()).totalProductCount !== null
    )
  );

/**
 * Emits when a category is ready to be tracked,
 * considering loaded or preloaded data.
 */
export const categoryIsReady$ = dataLoaded$.merge(dataPreloaded$);
