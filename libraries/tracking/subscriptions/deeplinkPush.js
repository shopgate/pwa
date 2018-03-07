/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  OPEN_DEEP_LINK,
  OPEN_PUSH_NOTIFICATION,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { track } from '../helpers/index';

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
  subscribe(deeplinkOpened$, ({ getState, action }) => {
    const state = getState();
    const { link = '', sourceApp = '', wasOpenedFromSearchIndex } = action.payload;
    const eventLabel = wasOpenedFromSearchIndex ? 'os_search' : sourceApp;

    track('openDeepLink', {
      eventAction: link,
      eventLabel,
    }, state);

    track('setCampaignWithUrl', {
      url: link,
      type: 'deeplink',
    }, state);
  });

  /**
   * Gets triggered when a push was opened.
   */
  subscribe(pushOpened$, ({ getState, action }) => {
    const state = getState();
    const notificationId = action.notificationId ? action.notificationId.toString() : 'n/a';

    track('openPushNotification', {
      eventAction: 'opened',
      eventLabel: notificationId,
    }, state);

    track('setCampaignWithUrl', {
      url: action.link,
      notificationId,
      type: 'push_message',
    }, state);
  });
}
