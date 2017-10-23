/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import { setSearchPhrase } from 'Components/Navigator/action-creators';
import { BROWSE_PATH } from './constants';

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  // Derived streams.
  const browseRouteDidEnterOrLeave$ = routeDidEnter(BROWSE_PATH)
    .merge(routeDidLeave(BROWSE_PATH));

  /**
   * Gets triggered on entering or leaving the browse route. Resets the search phrase.
   */
  subscribe(browseRouteDidEnterOrLeave$, ({ dispatch }) => dispatch(setSearchPhrase('')));
}
