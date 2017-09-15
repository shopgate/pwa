/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_CURRENT_REVIEWS_PRODUCT_ID } from '../constants';

/**
 * Dispatches the SET_CURRENT_REVIEWS_PRODUCT_ID action.
 * @param {string} productId The ID of the product
 * @returns {Object} The SET_CURRENT_REVIEWS_PRODUCT_ID action
 */
const setCurrentReviewsProductId = productId => ({
  type: SET_CURRENT_REVIEWS_PRODUCT_ID,
  productId,
});

export default setCurrentReviewsProductId;
