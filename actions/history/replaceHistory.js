/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import changeHistory from './helpers/changeHistory';

/**
 * Replaces the current location in the history.
 * @param {Object|string} location The location to set.
 * @returns {Function} A redux thunk.
 */
export default changeHistory('replace');
