/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_LOGOUT } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
const successLogout = () => ({
  type: SUCCESS_LOGOUT,
});

export default successLogout;
