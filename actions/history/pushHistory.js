/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import changeHistory from './helpers/changeHistory';

/**
 * Pushes a new location on top of the history.
 * @param {Object|string} location The location to push to the history.
 * @returns {Function} A redux thunk.
 */
export default changeHistory('push');
