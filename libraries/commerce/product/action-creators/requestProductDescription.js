/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_DESCRIPTION } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that requests description.
 * @return {Object} The REQUEST_PRODUCT_DESCRIPTION action.
 */
const requestProductDescription = productId => ({
  type: REQUEST_PRODUCT_DESCRIPTION,
  productId,
});

export default requestProductDescription;
