/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { productsAdded$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { getAddToCartProducts } from '../selectors/cart';
import { track } from '../helpers/index';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered on product variant change/selection
   */
  subscribe(productsAdded$, ({ getState, action }) => {
    const state = getState();
    const products = getAddToCartProducts(state, action.products);

    track('addToCart', { products }, state);
  });
}
