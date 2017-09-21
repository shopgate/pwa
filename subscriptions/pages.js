/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import makeTracker from '../helpers/makeTracker';
import {
  categoryIsReady$,
} from '../streams/category';
import {
  searchDidEnter$,
  searchIsReady$,
  searchDidLeave$,
} from '../streams/search';
import {
  productIsReady$,
} from '../streams/product';
import getTrackingData from '../selectors';

/**
 * Calls the pageview core tracking function.
 * @param {Object} input The input of the tracked stream.
 */
const callPageViewTracker = ({ getState }) => {
  core.track.pageview(
    getTrackingData(
      getState()
    )
  );
};

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function pages(subscribe) {
  const trackPageView = makeTracker(subscribe, callPageViewTracker);

  // Track category page.
  trackPageView(
    appDidStart$,
    categoryIsReady$
  );

  // Track search page.
  trackPageView(
    searchDidEnter$,
    searchIsReady$,
    searchDidLeave$
  );

  // Track product page.
  trackPageView(
    appDidStart$,
    productIsReady$
  );
}
