/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';

/**
 * Combine the reducers.
 * @param {Object} reducers The reducers.
 * @returns {Function}
 */
const rootReducer = reducers => combineReducers(reducers);

export default rootReducer;
