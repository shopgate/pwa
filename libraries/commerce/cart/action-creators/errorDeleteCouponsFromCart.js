/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched ERROR_DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed DELETE_COUPONS_FROM_CART action.
 * @param {Array} [errors] A list of errors messages for the coupons.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const errorDeleteCouponsFromCart = (couponsIds, errors = [], requestsPending = false) => ({
  type: ERROR_DELETE_COUPONS_FROM_CART,
  couponsIds,
  errors,
  requestsPending,
});

export default errorDeleteCouponsFromCart;
