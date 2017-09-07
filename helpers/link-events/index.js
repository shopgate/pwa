/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import event from '@shopgate/pwa-core/classes/Event';
import { logger } from '@shopgate/pwa-core/helpers';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import ParsedLink from '../parsed-link';

const PUSH_MESSAGE_OPENED = 'ajax_push_message_opened';

registerEvents(['openPushNotification', 'openDeepLink']);

/**
 * Handler for the openPushNotification event
 * @param {Object} payload The event payload
 */
const handleOpenPushNotification = (payload = {}) => {
  const { link = '' } = payload;
  let { notificationId } = payload;

  notificationId = notificationId ? notificationId.toString() : null;

  if (notificationId) {
    new DataRequest(PUSH_MESSAGE_OPENED)
      .setPayload({
        notificationId,
      })
      .dispatch()
        .then(result => logger.info(PUSH_MESSAGE_OPENED, result))
        .catch(err => err && logger.error(err));
  }

  if (link) {
    const parsedLink = new ParsedLink(link);
    parsedLink.open();
  }
};

/**
 * Handler for the openDeepLink event
 * @param {Object} payload The event payload
 */
const handleOpenDeepLink = (payload = {}) => {
  const { link = '' } = payload;

  if (link) {
    const parsedLink = new ParsedLink(link);
    parsedLink.open();
  }
};

/**
 * Attaches all link event related listeners
 */
const attachLinkEvents = () => {
  event.addCallback('openPushNotification', handleOpenPushNotification);
  event.addCallback('openDeepLink', handleOpenDeepLink);
};

/**
 * Detaches all link event related listeners
 */
const detachLinkEvents = () => {
  event.removeCallback('openPushNotification', handleOpenPushNotification);
  event.removeCallback('openDeepLink', handleOpenDeepLink);
};

export {
  attachLinkEvents,
  detachLinkEvents,
};
