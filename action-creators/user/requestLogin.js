/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_LOGIN } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const requestLogin = () => ({
  type: REQUEST_LOGIN,
});

export default requestLogin;
