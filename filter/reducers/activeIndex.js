/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_FILTER_INDEX } from '../constants';

/**
 * Stores the index of the current active filter set.
 * @param {Object} [state=null] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function activeIndex(state = null, action) {
  switch (action.type) {
    case SET_FILTER_INDEX: {
      return action.index;
    }
    default:
      return state;
  }
}
