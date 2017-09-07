/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_CLIENT_INFORMATION } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_CLIENT_INFORMATION action object.
 * @param {Object} data The received client information data.
 * @returns {Object} The dispatched action object.
 */
const receiveClientInformation = data => ({
  type: RECEIVE_CLIENT_INFORMATION,
  data,
});

export default receiveClientInformation;
