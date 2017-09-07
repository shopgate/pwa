/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_CART } from '../constants';

/**
 * Creates the dispatched RECEIVE_CART action object
 * @param {Object} cart The cart data
 * @return {Object} The RECEIVE_CART action.
 */
const receiveCart = cart => ({
  type: RECEIVE_CART,
  cart,
});

export default receiveCart;
