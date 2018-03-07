/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ERROR_ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { productsUpdated$, productsAdded$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { routeDidEnter, routeDidLeave } from '@shopgate/pwa-common/streams/history';
import {
  resetActionCount,
  decrementActionCount,
  incrementActionCount,
} from './actions';

/**
 * AddToCartBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function addToCartBar(subscribe) {
  const itemRouteDidEnter$ = routeDidEnter(ITEM_PATH);
  const itemRouteDidLeave$ = routeDidLeave(ITEM_PATH);

  const productNotAdded = productsUpdated$.filter(({ action }) => (
    action.type === ERROR_ADD_PRODUCTS_TO_CART
  ));

  /**
   * Gets triggered when the item route was entered.
   */
  subscribe(itemRouteDidEnter$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  /**
   * Gets triggered when the item route was left.
   */
  subscribe(itemRouteDidLeave$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  subscribe(variantDidChange$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  subscribe(productsAdded$, ({ dispatch }) => {
    dispatch(incrementActionCount());
  });

  subscribe(productNotAdded, ({ dispatch }) => {
    dispatch(decrementActionCount());
  });
}
