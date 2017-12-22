/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getProductVariants from './getProductVariants';
import getProductOptions from './getProductOptions';

/**
 * Processes the flags of a product and requests additional data if necessary.
 * @param {Object} product A single product.
 * @returns {Function} A redux thunk.
 */
const processProductFlags = product => (dispatch) => {
  const { id, flags = {} } = product;
  const {
    hasVariants = false,
    hasOptions = false,
  } = flags;

  if (hasVariants) {
    dispatch(getProductVariants(id));
  }

  if (hasOptions) {
    dispatch(getProductOptions(id));
  }
};

export default processProductFlags;
