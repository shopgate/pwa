/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  OPEN_DEEP_LINK,
  OPEN_PUSH_NOTIFICATION,
} from '@shopgate/pwa-common/constants/ActionTypes';

/**
 * Emits when a deeplink was opened.
 */
const deeplinkOpened$ = main$
  .filter(({ action }) => action.type === OPEN_DEEP_LINK);

/**
 * Emits when a push message was opened.
 */
const pushOpened$ = main$
  .filter(({ action }) => action.type === OPEN_PUSH_NOTIFICATION);

/**
 * Deeplink and push message tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function deeplinkPush(subscribe) {
  /**
   * Gets triggered when a deeplink was opened.
   */
  subscribe(deeplinkOpened$, ({ action }) => {
    const { link = '', sourceApp = '', wasOpenedFromSearchIndex } = action.payload;
    const eventLabel = wasOpenedFromSearchIndex ? 'os_search' : sourceApp;

    core.track.openDeepLink({
      eventAction: link,
      eventLabel,
    });

    core.track.setCampaignWithUrl({
      url: link,
      type: 'deeplink',
    });
  });

  /**
   * Gets triggered when a push was opened.
   */
  subscribe(pushOpened$, ({ action }) => {
    const notificationId = action.notificationId ? action.notificationId.toString() : 'n/a';

    core.track.openPushNotification({
      eventAction: 'opened',
      eventLabel: notificationId,
    });

    core.track.setCampaignWithUrl({
      url: action.link,
      notificationId,
      type: 'push_message',
    });
  });
}
