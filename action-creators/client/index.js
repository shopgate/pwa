/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
export const requestClientInformation = () => ({
  type: REQUEST_CLIENT_INFORMATION,
});

/**
 * Creates the dispatched RECEIVE_CLIENT_INFORMATION action object.
 * @param {Object} data The received client information data.
 * @returns {Object} The dispatched action object.
 */
export const receiveClientInformation = data => ({
  type: RECEIVE_CLIENT_INFORMATION,
  data,
});

/**
 * Creates the dispatched ERROR_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
export const errorClientInformation = () => ({
  type: ERROR_CLIENT_INFORMATION,
});
