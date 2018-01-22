/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PRODUCT_LIFETIME } from '../../constants';
import enrichProduct from './enrichProduct';

/**
 * Builds state entries from a collection of products (Array).
 * @param {Array} products A products collection.
 * @return {Object} The product entries for the state.
 */
const handleProductCollection = (products) => {
  if (!Array.isArray(products)) {
    return {};
  }

  return products.reduce((currentProducts, product) => ({
    ...currentProducts,
    [product.id]: {
      productData: enrichProduct(product),
      isFetching: false,
      expires: Date.now() + PRODUCT_LIFETIME,
    },
  }), {});
};

export default handleProductCollection;
