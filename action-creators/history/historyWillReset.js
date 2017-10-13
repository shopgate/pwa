/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HISTORY_WILL_RESET } from '../../constants/ActionTypes';

/**
 * Creates the HISTORY_WILL_RESET action object.
 * @returns {Object} A redux action.
 */
const historyWillReset = () => ({
  type: HISTORY_WILL_RESET,
});

export default historyWillReset;
