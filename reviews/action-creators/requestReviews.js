/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_REVIEWS action.
 * @param {string} hash Generated hash.
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action.
 */
const requestReviews = hash => ({
  type: REQUEST_REVIEWS,
  hash,
});

export default requestReviews;
