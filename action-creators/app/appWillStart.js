/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { APP_WILL_START } from '../../constants/ActionTypes';

/**
 * Creates the dispatched APP_WILL_START action object.
 * @param {Object} location The initial history entry location.
 * @returns {Object} The dispatched action object.
 */
const appWillStart = location => ({
  type: APP_WILL_START,
  location,
});

export default appWillStart;
