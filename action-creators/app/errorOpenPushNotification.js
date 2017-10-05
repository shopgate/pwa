/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_OPEN_PUSH_NOTIFICATION } from '../../constants/ActionTypes';

/**
 * Creates the ERROR_OPEN_PUSH_NOTIFICATION action object.
 * @param {string} notificationId The push notification ID.
 * @returns {Object} A redux action.
 */
const errorOpenPushNotification = notificationId => ({
  type: ERROR_OPEN_PUSH_NOTIFICATION,
  notificationId,
});

export default errorOpenPushNotification;
