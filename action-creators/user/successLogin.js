/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_LOGIN } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const successLogin = () => ({
  type: SUCCESS_LOGIN,
});

export default successLogin;
