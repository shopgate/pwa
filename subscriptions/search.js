/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { searchIsReady$ } from '../streams/search';
import getTrackingData from '../selectors/search';
import { track } from '../helpers/index';

/**
 * Search tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchIsReady$, ({ getState }) => {
    const state = getState();

    track('search', {
      search: getTrackingData(state),
    }, state);
  });
}
