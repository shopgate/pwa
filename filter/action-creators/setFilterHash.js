/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_FILTER_HASH } from '../constants';

/**
 * Creates the dispatched SET_FILTER_HASH action object.
 * @param {Object} hash The filter hash.
 * @returns {Object} The SET_FILTER_HASH action.
 */
const setFilterHash = hash => ({
  type: SET_FILTER_HASH,
  hash,
});

export default setFilterHash;
