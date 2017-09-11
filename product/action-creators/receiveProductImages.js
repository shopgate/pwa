/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_IMAGES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} productImages List of product images.
 * @return {Object} The RECEIVE_PRODUCT_IMAGES action.
 */
const receiveProductImages = (productId, productImages) => ({
  type: RECEIVE_PRODUCT_IMAGES,
  productId,
  productImages,
});

export default receiveProductImages;
