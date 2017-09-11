/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCT_IMAGES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @return {Object} The ERROR_PRODUCT_IMAGES action.
 */
const errorProductImages = productId => ({
  type: ERROR_PRODUCT_IMAGES,
  productId,
});

export default errorProductImages;
