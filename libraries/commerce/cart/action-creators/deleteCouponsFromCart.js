/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
const deleteCouponsFromCart = couponIds => ({
  type: DELETE_COUPONS_FROM_CART,
  couponIds,
});

export default deleteCouponsFromCart;
