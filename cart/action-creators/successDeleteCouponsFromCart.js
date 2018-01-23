/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_DELETE_COUPONS_FROM_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successDeleteCouponsFromCart = () => ({
  type: SUCCESS_DELETE_COUPONS_FROM_CART,
});

export default successDeleteCouponsFromCart;
