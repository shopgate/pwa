/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import openPushNotification from '../../action-creators/app/openPushNotification';
import handleLink from './handleLink';

const PUSH_MESSAGE_OPENED = 'ajax_push_message_opened';

/**
 * Handles the opening of a push notification. If the payload contains a link, it calls
 * the openDeepLink actions additionally.
 * @param {Object} payload The push notifiction payload.
 * @return {Function} A redux thunk.
 */
const handlePushNotification = (payload = {}) => (dispatch) => {
  const { link = '', notificationId = null } = payload;

  if (notificationId) {
    const id = notificationId.toString();

    // Send tracking event to the backend
    new DataRequest(PUSH_MESSAGE_OPENED)
      .setPayload({ notificationId: id })
      .dispatch();
  }

  handleLink({ link });

  dispatch(openPushNotification(notificationId, link));
};

export default handlePushNotification;
