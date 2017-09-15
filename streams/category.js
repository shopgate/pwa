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
import { RECEIVE_PRODUCTS } from '@shopgate/pwa-common-commerce/product/constants';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Gets triggered when the page title is available.
 * @type {Observable}
 */
const categoryIdChanged$ = main$
  .filter(
    ({ action }) => (
      // TODO: Root category needs to be considered.
      action.type === SET_CURRENT_CATEGORY_ID &&
      !!action.categoryId
    )
  );

/**
 * Set up streams that emits when specific category data has been received.
 */
const childrenReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_CATEGORY_CHILDREN);

const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Combine specific data streams that emits when all category data has been received.
 */
const dataLoaded$ = categoryIdChanged$
  .zip(productsReceived$, childrenReceived$)
  .map(([first]) => first);

/**
 * Set up stream that emits when category that is already available.
 */
const dataPreloaded$ = categoryIdChanged$
  .filter(
    // TODO: Validate if child categories and other related data is available.
    ({ getState }) => getProductsResult(getState()).totalProductCount !== null
  );

/**
 * Combine a stream that emits when data is ready,
 * considering loaded or preloaded data.
 */
export const categoryIsReady$ = dataLoaded$.merge(dataPreloaded$);
