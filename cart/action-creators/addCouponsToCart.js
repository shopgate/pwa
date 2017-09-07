/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched ADD_COUPONS_TO_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
const addCouponsToCart = couponIds => ({
  type: ADD_COUPONS_TO_CART,
  couponIds,
});

export default addCouponsToCart;
