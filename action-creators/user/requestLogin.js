/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_LOGIN } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_LOGIN action object.
 * It also passes login credentials to the action,
 * in order to may access it within a stream subscription.
 * @param {string} user The user name.
 * @param {string} password The user password.
 * @returns {Object} The dispatched action object.
 */
const requestLogin = (user, password) => ({
  type: REQUEST_LOGIN,
  user,
  password,
});

export default requestLogin;
