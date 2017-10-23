/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_USER_REVIEW } from '../constants';

/**
 * Dispatches the REQUEST_USER_REVIEW action.
 * @param {string} productId The ID of the product
 * @returns {Object} The REQUEST_USER_REVIEW action.
 */
const requestUserReview = productId => ({
  type: REQUEST_USER_REVIEW,
  productId,
});

export default requestUserReview;
