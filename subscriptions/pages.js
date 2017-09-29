/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { categoryIsReady$ } from '../streams/category';
import { searchIsReady$ } from '../streams/search';
import { productIsReady$ } from '../streams/product';
import { pagesAreReady$ } from '../streams/pages';
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
  subscribe(categoryIsReady$, callPageViewTracker);
  subscribe(searchIsReady$, callPageViewTracker);
  subscribe(productIsReady$, callPageViewTracker);
  subscribe(pagesAreReady$, callPageViewTracker);
}
