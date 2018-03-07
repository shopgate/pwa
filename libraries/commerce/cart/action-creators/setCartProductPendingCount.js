/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_CART_PENDING_PRODUCT_COUNT } from '../constants';

/**
 * Creates the dispatched SET_CART_PENDING_PRODUCT_COUNT object.
 * @param {number} count The cart product count.
 * @return {Object} The SET_CART_PENDING_PRODUCT_COUNT action.
 */
const setCartProductPendingCount = count => ({
  type: SET_CART_PENDING_PRODUCT_COUNT,
  count,
});

export default setCartProductPendingCount;
