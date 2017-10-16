/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { searchIsReady$ } from '../streams/search';
import getTrackingData from '../selectors/search';

/**
 * Search tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchIsReady$, ({ getState }) => {
    core.track.search({
      search: getTrackingData(getState()),
    });
  });
}
