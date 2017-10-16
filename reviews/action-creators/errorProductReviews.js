/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action
 */
const errorProductReviews = productId => ({
  type: ERROR_PRODUCT_REVIEWS,
  productId,
});

export default errorProductReviews;
