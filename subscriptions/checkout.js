/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import getCart from '../selectors/cart';
import { track, formatPurchaseData } from '../helpers/index';

/**
 * Checkout tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Emits when the checkout route was entered.
   */
  const checkoutDidEnter$ = routeDidEnter(CHECKOUT_PATH);

  subscribe(checkoutDidEnter$, ({ getState }) => {
    const state = getState();

    track('initiatedCheckout', { cart: getCart(state) }, state);
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ getState }) => {
    event.addCallback('checkoutSuccess', (data = {}) => {
      /**
       * Don't track the legacy checkout here for now, because it would be tracked twice.
       * We can remove this as soon as we disabled the purchase tracking in the legacy checkout.
       */
      if (data.type === 'legacy' || typeof data.order === 'undefined') {
        return;
      }

      track('purchase', formatPurchaseData(data.order), getState());
    });
  });
}
