/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getProductVariants from './getProductVariants';
import getProductOptions from './getProductOptions';
import getProduct from './getProduct';
import setProductId from '../action-creators/setProductId';
import setProductVariantId from '../action-creators/setProductVariantId';

/**
 * Processes the flags of a product and requests additional data if necessary.
 * @param {Object} product A single product.
 * @returns {Function} A redux thunk.
 */
const processProductFlags = product => (dispatch) => {
  const { id, flags = {}, baseProductId } = product;
  const {
    hasVariants = false,
    hasOptions = false,
  } = flags;

  // We requested data for a child product. So we have to request also the parent product
  if (baseProductId) {
    dispatch(getProduct(baseProductId));
    dispatch(setProductId(baseProductId));
    dispatch(setProductVariantId(id));
  }

  if (hasVariants) {
    dispatch(getProductVariants(id));
  }

  if (hasOptions) {
    dispatch(getProductOptions(id));
  }
};

export default processProductFlags;
