/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UPDATE_HISTORY } from '../../constants/ActionTypes';

/**
 * Creates the UPDATE_HISTORY action object.
 * @param {Object} historyProps The updated history props.
 * @returns {Object} A redux action.
 */
const updateHistory = historyProps => ({
  type: UPDATE_HISTORY,
  historyProps,
});

export default updateHistory;
