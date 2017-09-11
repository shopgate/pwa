/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_IMAGES } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_IMAGES action.
 * @param {string} productId The ID of the product to request the images.
 * @return {Object} The REQUEST_PRODUCT_IMAGES action.
 */
const requestProductImages = productId => ({
  type: REQUEST_PRODUCT_IMAGES,
  productId,
});

export default requestProductImages;
