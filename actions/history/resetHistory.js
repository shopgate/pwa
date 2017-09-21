/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import goBackHistory from './goBackHistory';
import pushHistory from './pushHistory';

/**
 * Resets the history, clearing any previous entry.
 * @param {Object|string|null} [location=null] The location to set after the reset.
 * @returns {Function} A redux thunk.
 */
export default (location = null) => (dispatch, getState) => {
  const numEntries = getState().history.length;
  // Go back the exact amount of entries stored in the history.
  dispatch(goBackHistory(numEntries - 1));

  // Set the new location if requested.
  if (location) {
    dispatch(pushHistory(location));
  }
};
