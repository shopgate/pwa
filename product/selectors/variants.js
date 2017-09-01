/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';

/**
 * Selects collection of all stored product variants from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of product variants.
 */
const getVariantsState = state => state.product.variantsByProductId;

/**
 * Selects collection of all stored products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
const getProducts = state => state.product.productsById;

/**
 * Gets the id of the currently selected product variant.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getCurrentProductVariantId = state => state.currentProduct.productVariantId;

/**
 * Retrieves the current base product for the detail page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current base product.
 */
export const getCurrentBaseProductId = state => state.currentProduct.productId;

/**
 * Retrieves the current base product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentBaseProduct = createSelector(
  getProducts,
  getCurrentBaseProductId,
  (products, productId) => {
    if (!products[productId] || products[productId].isFetching) {
      return null;
    }
    return products[productId].productData;
  }
);

/**
 * Checks if the current product has variants.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasCurrentProductVariants = createSelector(
  getCurrentBaseProduct,
  (product) => {
    if (!product) {
      return false;
    }

    return product.flags.hasVariants;
  }
);

/**
 * Checks if the children for the current product is selected.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isProductChildrenSelected = state => !!getCurrentProductVariantId(state);

/**
 * Retrieves product variants by product ID from state.
 * @param {Object} state The current application state.
 * @param {string} productId The product ID.
 * @return {Object|null} The dedicated variants. Or null when the requested data is unavailable.
 */
export const getVariantsByProductId = (state, productId) => createSelector(
  getVariantsState,
  (variants) => {
    if (!variants || !variants[productId] || variants[productId].isFetching === true) {
      return null;
    }

    return variants[productId];
  }
);

/**
 * Retrieves product variants for the currently selected base product from state.
 * @param {Object} state The current application state.
 * @return {Object|null} The dedicated variants. Or null when the requested data is unavailable.
 */
export const getCurrentBaseProductVariants = createSelector(
  getVariantsState,
  getCurrentBaseProductId,
  (variantsState, productId) => {
    if (
      !variantsState ||
      !variantsState[productId] ||
      variantsState[productId].isFetching === true
    ) {
      return null;
    }

    return variantsState[productId];
  }
);
