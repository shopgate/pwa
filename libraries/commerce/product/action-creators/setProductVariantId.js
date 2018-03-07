/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_PRODUCT_VARIANT_ID } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_VARIANTS_ID action object.
 * @param {string|null} productVariantId The product variant id.
 * @returns {Object} The dispatched action object.
 */
const setProductVariantId = productVariantId => ({
  type: SET_PRODUCT_VARIANT_ID,
  productVariantId,
});

export default setProductVariantId;
