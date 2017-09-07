/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TOGGLE_LOGGED_IN } from '../../constants/ActionTypes';

/**
 * Creates the dispatched TOGGLE_LOGGED_IN action object.
 * @param {boolean} value The updated logged in state.
 * @returns {Object} The dispatched action object.
 */
const toggleLoggedIn = value => ({
  type: TOGGLE_LOGGED_IN,
  value,
});

export default toggleLoggedIn;
