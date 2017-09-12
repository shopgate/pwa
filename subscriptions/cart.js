/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import tracking from '@shopgate/tracking-core/core/Core';

export default function cart(subscribe) {
  /**
   * Gets triggered when the route changes.
   */
  subscribe(addedProduct$, ({ getState, pathname }) => {

    tracking.track.addToCart({

    });
  });
}


// TODOs:


// OPEN PUSH
tracking.track.openPushNotification({
  eventAction: 'opened',
  eventLabel: notificationId || 'n/a',
});
tracking.track.setCampaignWithUrl({
  url: link,
  notificationId,
  type: 'push_message',
});


// OPEN DEEPLINK
tracking.track.openDeepLink({
  eventAction: link,
  eventLabel,
});

tracking.track.setCampaignWithUrl({
  url: link,
  type: 'deeplink',
});

// VIEW CONTENT (additional pageview for product page with product data)
tracking.track.viewContent();

// SEARCH

// initiatedCheckout

