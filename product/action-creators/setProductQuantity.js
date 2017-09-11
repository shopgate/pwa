/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_PRODUCT_QUANTITY } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_QUANTITY action object.
 * @param {number} quantity The product variant id.
 * @returns {Object} The dispatched action object.
 */
const setProductQuantity = quantity => ({
  type: SET_PRODUCT_QUANTITY,
  quantity,
});

export default setProductQuantity;
