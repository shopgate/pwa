/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { routeDidChange$ } from '@shopgate/pwa-common/streams/history';
import getTrackingData from '../selectors';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function pages(subscribe) {
  /**
   * Gets triggered when the route changes.
   */
  subscribe(routeDidChange$, ({ getState }) => (
    /*
    TODO: Use route specific subscriptions.
    In order to implement logic that waits for needed data.
    Like the page title, when entering a product page.
    */
    core.track.pageview(
      getTrackingData(
        getState()
      )
    )
  ));
}
