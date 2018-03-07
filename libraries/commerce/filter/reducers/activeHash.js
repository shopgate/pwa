/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_FILTER_HASH } from '../constants';

/**
 * Stores a collection of available filters by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function hash(state = null, action) {
  switch (action.type) {
    case SET_FILTER_HASH:
      return action.hash;
    default:
      return state;
  }
}
