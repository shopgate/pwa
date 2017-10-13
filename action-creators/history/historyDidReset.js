/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HISTORY_DID_RESET } from '../../constants/ActionTypes';

/**
 * Creates the HISTORY_DID_RESET action object.
 * @returns {Object} A redux action.
 */
const historyDidReset = () => ({
  type: HISTORY_DID_RESET,
});

export default historyDidReset;
