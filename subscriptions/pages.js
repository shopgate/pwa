/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import getTrackingData from '../selectors';
import { categoryIsReady$ } from '../streams/category';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function pages(subscribe) {
  // TODO: Merge all streams that should track 'pageview'.

  /**
   * Gets triggered when category page is ready.
   */
  subscribe(categoryIsReady$, ({ getState }) => (
    core.track.pageview(
      getTrackingData(
        getState()
      )
    )
  ));
}
