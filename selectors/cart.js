/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { getProductById } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  getSubTotal,
  getCurrency,
  getCartProducts,
} from '@shopgate/pwa-common-commerce/cart/selectors/index';

/**
 * Reformat product data from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
const formatProductData = ({ product, quantity }) => ({
  uid: product.id,
  name: product.name,
  amount: {
    gross: product.price.unit,
  },
  quantity,
});

/**
 * Selects the products from the cart and reformat them.
 * @param {Object} state The current state.
 * @return {Array} The reformatted products.
 */
const getProducts = createSelector(
  getCartProducts,
  products => products.map(formatProductData)
);

/**
 * Selects products by ID and reformat them.
 * @param {Object} state The current state.
 * @param {Array} items Array of items.
 * @returns {Array} Formatted products.
 */
export const getAddToCartProducts = (state, items) => (
  items
    .map(item => ({
      product: getProductById(state, item.productId).productData,
      quantity: item.quantity,
    }))
    .map(formatProductData)
);

/**
 * Selects the cart information.
 * @param {Object} state The current state.
 * @returns {Object} The cart information.
 */
export default createSelector(
  getSubTotal,
  getCurrency,
  getProducts,
  (subTotal, currency, products) => ({
    amount: {
      // TODO: net is not possible at the moment
      gross: subTotal,
      currency,
    },
    products,
    productsCount: products.length,
  })
);
