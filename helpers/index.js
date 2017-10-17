/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Converts a price to a formatted string.
 * @param {number} price The original price.
 * @return {string|*} The converted price or the original value, if the price was not convertible.
 */
export const convertPriceToString = (price) => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }

  return price;
};

/**
 * Re-format a given product form the store.
 * @param {Object} productData The product data from the store
 * @returns {Object|null} The formatted product.
 */
export const formatProductData = (productData) => {
  if (!productData) {
    return null;
  }

  const { id, name, price, tags = [] } = productData;

  return {
    name,
    tags,
    uid: id,
    amount: {
      net: convertPriceToString(price.unitPriceNet),
      gross: convertPriceToString(price.unitPriceWithTax),
      currency: price.currency,
    },
  };
};

/**
 * Reformat product data for addToCart from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatAddToCartProductData = ({ product, quantity }) => ({
  ...formatProductData(product),
  quantity,
});

/**
 * Reformat product data from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatCartProductData = ({ product, quantity }) => ({
  uid: product.id,
  name: product.name,
  amount: {
    gross: convertPriceToString(product.price.unit),
  },
  quantity,
});
