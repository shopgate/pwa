/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { calcDiscount } from '../helpers';
import { PRODUCT_LIFETIME } from '../constants';

/**
 * Enriches a product object with additional properties that are helpful for the frontend,
 * but not available via the API.
 * @param {Object} productData A product object
 * @return {Object} The enriched product
 */
export const enrichProduct = (productData) => {
  const newProductData = {
    ...productData,
  };

  if (
    newProductData.price &&
    newProductData.price.unitPrice &&
    newProductData.price.unitPriceStriked
  ) {
    let discount = 0;

    // Calculate the saved percentage discount and add it to the product
    if (newProductData.price.unitPrice < newProductData.price.unitPriceStriked) {
      discount = calcDiscount(
        newProductData.price.unitPrice,
        newProductData.price.unitPriceStriked
      );
    }

    newProductData.price.discount = discount;
  }

  return newProductData;
};

/**
 * Builds state entries from a collection of products (Array).
 * @param {Array} products A products collection.
 * @return {Object} The product entries for the state.
 */
export const handleProductCollection = (products) => {
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
