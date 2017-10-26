/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_USER_REVIEW } from '../constants';

/**
 * Dispatches the ERROR_USER_REVIEW action.
 * @param {string} productId The ID of the product
 * @returns {Object} The ERROR_USER_REVIEW action
 */
const errorUserReview = productId => ({
  type: ERROR_USER_REVIEW,
  productId,
});

export default errorUserReview;
