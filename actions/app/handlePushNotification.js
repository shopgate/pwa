/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import openPushNotification from '../../action-creators/app/openPushNotification';
import successOpenPushNotification from '../../action-creators/app/successOpenPushNotification';
import errorOpenPushNotification from '../../action-creators/app/errorOpenPushNotification';
import handleDeepLink from './handleDeepLink';

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
    dispatch(openPushNotification());

    new DataRequest(PUSH_MESSAGE_OPENED)
      .setPayload({ notificationId: notificationId.toString() })
      .dispatch()
        .then(result => dispatch(successOpenPushNotification(result)))
        .catch((error) => {
          logger.error(error);
          dispatch(errorOpenPushNotification(notificationId.toString()));
        });
  }

  if (link) {
    dispatch(handleDeepLink({ link }));
  }
};

export default handlePushNotification;
