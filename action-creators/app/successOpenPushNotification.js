/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_OPEN_PUSH_NOTIFICATION } from '../../constants/ActionTypes';

/**
 * Creates the SUCCESS_OPEN_PUSH_NOTIFICATION action object.
 * @param {Object} result The result of the open push notification request.
 * @returns {Object} A redux action.
 */
const successOpenPushNotification = result => ({
  type: SUCCESS_OPEN_PUSH_NOTIFICATION,
  result,
});

export default successOpenPushNotification;
