/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_VARIANTS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @return {Object} The REQUEST_PRODUCT_VARIANTS action.
 */
const requestProductVariants = productId => ({
  type: REQUEST_PRODUCT_VARIANTS,
  productId,
});

export default requestProductVariants;
