/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCT_DESCRIPTION } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that received description.
 * @return {Object} The ERROR_PRODUCT_DESCRIPTION action.
 */
const errorProductDescription = productId => ({
  type: ERROR_PRODUCT_DESCRIPTION,
  productId,
});

export default errorProductDescription;
