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
import { formatProductData } from './product';

/**
 * Reformat product data for addToCart from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
const formatAddToCartProductData = ({ product, quantity }) => ({
  ...formatProductData(product),
  quantity,
});

/**
 * Reformat product data from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
const formatCartProductData = ({ product, quantity }) => ({
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
  products => products.map(formatCartProductData)
);

/**
 * Selects products by ID and reformat them.
 * @param {Object} state The current state.
 * @param {Array} products Array of products.
 * @returns {Array} Formatted products.
 */
export const getAddToCartProducts = (state, products) => (
  products
    .map(product => ({
      product: getProductById(state, product.productId).productData,
      quantity: product.quantity,
    }))
    .map(formatAddToCartProductData)
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
