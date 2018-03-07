/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_CART } from '../constants';

/**
 * Creates the dispatched REQUEST_CART action object.
 * @return {Object} The REQUEST_CART action.
 */
const requestCart = () => ({
  type: REQUEST_CART,
});

export default requestCart;
