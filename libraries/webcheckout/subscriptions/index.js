/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  userWillLogin$,
  userDidLogin$,
  userWillLogout$,
} from '@shopgate/pwa-common/streams/user';
import redirectRoute from '@shopgate/pwa-common/actions/history/redirectRoute';
import { hasShopifyCheckout } from '../selectors';
import login from '../actions/login';
import logout from '../actions/logout';
import { shopifyDidRespond$ } from '../streams';

/**
 * Shopify subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function shopify(subscribe) {
  /**
   * Don't create any subscriptions if there is no Shopify checkout available.
   */
  if (!hasShopifyCheckout()) {
    return;
  }

  /**
   * Gets triggered when the user did log in and a Shopify response was received.
   */
  const shouldRedirect$ = userDidLogin$.zip(shopifyDidRespond$).map(([first]) => first);

  subscribe(shouldRedirect$, ({ dispatch }) => {
    dispatch(redirectRoute());
  });

  /**
   * Gets triggered when the user wants to login.
   */
  subscribe(userWillLogin$, ({ dispatch, action }) => {
    dispatch(login(action.user, action.password));
  });

  /**
   * Gets triggered when the user wants to logout.
   */
  subscribe(userWillLogout$, ({ dispatch }) => {
    dispatch(logout());
  });
}
