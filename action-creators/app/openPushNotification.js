/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPEN_PUSH_NOTIFICATION } from '../../constants/ActionTypes';

/**
 * Creates the OPEN_PUSH_NOTIFICATION action object.
 * @returns {Object} A redux action.
 */
const openPushNotification = () => ({
  type: OPEN_PUSH_NOTIFICATION,
});

export default openPushNotification;
