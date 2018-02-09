/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const successUpdateProductsInCart = (requestsPending = false) => ({
  type: SUCCESS_UPDATE_PRODUCTS_IN_CART,
  requestsPending,
});

export default successUpdateProductsInCart;
