/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_REVIEWS action.
 * @param {string} hash Generated hash.
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action.
 */
const errorProductReviews = hash => ({
  type: ERROR_REVIEWS,
  hash,
});

export default errorProductReviews;
