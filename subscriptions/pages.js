/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import tracking from '@shopgate/tracking-core/core/Core';
import { routeDidChange$ } from '@shopgate/pwa-common/streams/history';
import { getQueryParamsAsString } from '@shopgate/pwa-common/selectors/history';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function pages(subscribe) {
  /**
   * Gets triggered when the route changes.
   */
  subscribe(routeDidChange$, ({ getState, pathname }) => {
    const link = `${pathname}${getQueryParamsAsString(getState())}`;

    tracking.track.pageview({
      page: {
        link,
        title: 'some title',
        name: 'some name',
      },
    });
  });
}
