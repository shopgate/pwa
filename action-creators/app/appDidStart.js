/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { APP_DID_START } from '../../constants/ActionTypes';

/**
 * Creates the dispatched APP_DID_START action object.
 * @returns {Object} The dispatched action object.
 */
const appDidStart = () => ({
  type: APP_DID_START,
});

export default appDidStart;
