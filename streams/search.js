/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { routeDidEnter, routeDidLeave } from '@shopgate/pwa-common/streams/history';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { productsReceived$ } from './product';

// TODO: Search is not tracked reliably / multiple times.

/**
 * Emits when the search route was entered.
 */
export const searchDidEnter$ = routeDidEnter(SEARCH_PATH);

/**
 * Emits when the search route was left.
 */
export const searchDidLeave$ = routeDidLeave(SEARCH_PATH);

/**
 * Emits when all necessary search data has been received.
 */
const dataLoaded$ = searchDidEnter$.zip(productsReceived$);

/**
 * Emits when the search result data is already available.
 */
const dataPreloaded$ = searchDidEnter$
  .shareReplay(1)
  .filter(
    ({ getState }) => (
      getProductsResult(getState()).totalProductCount !== null
    )
  );

/**
 * Emits when the search is ready to be tracked,
 * considering loaded or preloaded data.
 */
export const searchIsReady$ = dataLoaded$.merge(dataPreloaded$);
