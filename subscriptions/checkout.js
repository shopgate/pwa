/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { CHECKOUT_PATH } from '@shopgate/pwa-common-commerce/checkout/constants';
import getCart from '../selectors/cart';

/**
 * Checkout tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Emits when the checkout route was entered.
   */
  const checkoutDidEnter$ = routeDidEnter(CHECKOUT_PATH);

  subscribe(checkoutDidEnter$, ({ getState }) => (
    core.track.initiatedCheckout(getCart(getState()))
  ));
}
