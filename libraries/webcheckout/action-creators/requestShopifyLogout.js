/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_SHOPIFY_LOGOUT } from '../constants';

/**
 * Creates the dispatched REQUEST_SHOPIFY_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
const requestShopifyLogout = () => ({
  type: REQUEST_SHOPIFY_LOGOUT,
});

export default requestShopifyLogout;
