/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { replaceHistory } from './changeHistory';

/**
 * Updates the history location state by merging it with the previous state.
 * @param {Object} updatedState The state to update.
 * @returns {Function} A redux thunk.
 */
const updateHistoryState = updatedState => (dispatch, getState) => {
  const { history } = getState();

  dispatch(replaceHistory({
    state: {
      ...history.state,
      ...updatedState,
    },
  }));
};

export default updateHistoryState;
