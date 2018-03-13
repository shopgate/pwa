/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import trackingCore from '@shopgate/tracking-core/core/Core';
import { LEGACY_URL } from './constants';
import { openedCheckoutLink$ } from './streams';
import fetchCheckoutUrl from './actions/fetchCheckoutUrl';

/**
 * Checkout subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Gets triggered when the user enters the checkout.
   */
  subscribe(openedCheckoutLink$, ({ dispatch, getState }) => {
    // Check if user is logged in.
    if (!isUserLoggedIn(getState())) {
      return;
    }

    dispatch(fetchCheckoutUrl())
      .then((url) => {
        /**
         * Build the complete checkout url. Fallback to the
         * legacy url if the Pipeline returns an invalid url.
         * Add some tracking params for cross domain tracking.
         */
        const checkoutUrl = trackingCore.crossDomainTracking(url || LEGACY_URL);

        // Open the checkout.
        const link = new ParsedLink(checkoutUrl);
        link.open();
      })
      .catch(e => e);

    dispatch(goBackHistory(1));
  });
}
