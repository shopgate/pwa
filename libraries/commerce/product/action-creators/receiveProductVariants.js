/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_VARIANTS } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @param {Object} variants The data of the received product variants.
 * @return {Object} The RECEIVE_PRODUCT_VARIANTS action.
 */
const receiveProductVariants = (productId, variants) => ({
  type: RECEIVE_PRODUCT_VARIANTS,
  productId,
  variants,
});

export default receiveProductVariants;
