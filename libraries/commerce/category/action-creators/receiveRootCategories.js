/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the RECEIVE_ROOT_CATEGORIES action.
 * @param {Array} categories The received root categories.
 * @return {Object} The RECEIVE_ROOT_CATEGORIES action.
 */
const receiveRootCategories = categories => ({
  type: RECEIVE_ROOT_CATEGORIES,
  categories,
});

export default receiveRootCategories;
