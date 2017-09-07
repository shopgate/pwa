/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import getCart from '../actions/getCart';
import {
  cartRequesting$,
  cartReceived$,
  productsAdded$,
  productsModified$,
  productsUpdated$,
  productsDeleted$,
  couponsAdded$,
  couponsUpdated$,
  couponsDeleted$,
  remoteCartDidUpdate$,
} from '../streams';
import { setCartProductPendingCount } from '../action-creators';
import { CART_PATH } from '../constants';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when ever the local cart is out of
   * sync with the remote cart from the server.
   */
  const cartNeedsSync$ = userDidUpdate$.merge(remoteCartDidUpdate$);

  const cartBusy$ = cartRequesting$.merge(
    couponsAdded$,
    couponsDeleted$,
    productsAdded$,
    productsModified$,
    productsDeleted$
  );

  const cartIdle$ = cartReceived$.merge(
    couponsUpdated$,
    productsUpdated$
  );

  subscribe(cartNeedsSync$, ({ dispatch }) => {
    dispatch(getCart());
  });

  subscribe(cartBusy$, ({ dispatch }) => {
    dispatch(setViewLoading(CART_PATH));
  });

  subscribe(cartIdle$, ({ dispatch }) => {
    dispatch(unsetViewLoading(CART_PATH));
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Reset the productPendingCount on app start to avoid a wrong value in the cart badge.
    dispatch(setCartProductPendingCount(0));
  });
}
