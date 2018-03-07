/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_SHOPIFY_LOGIN } from '../constants';

/**
 * Creates the dispatched ERROR_SHOPIFY_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const errorShopifyLogin = () => ({
  type: ERROR_SHOPIFY_LOGIN,
});

export default errorShopifyLogin;
