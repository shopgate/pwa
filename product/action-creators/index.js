/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_PRODUCT,
  RECEIVE_PRODUCT,
  ERROR_PRODUCT,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCTS,
  REQUEST_PRODUCT_DESCRIPTION,
  RECEIVE_PRODUCT_DESCRIPTION,
  ERROR_PRODUCT_DESCRIPTION,
  REQUEST_PRODUCT_PROPERTIES,
  RECEIVE_PRODUCT_PROPERTIES,
  ERROR_PRODUCT_PROPERTIES,
  REQUEST_PRODUCT_IMAGES,
  RECEIVE_PRODUCT_IMAGES,
  ERROR_PRODUCT_IMAGES,
  REQUEST_PRODUCT_SHIPPING,
  RECEIVE_PRODUCT_SHIPPING,
  ERROR_PRODUCT_SHIPPING,
  REQUEST_PRODUCT_VARIANTS,
  RECEIVE_PRODUCT_VARIANTS,
  ERROR_PRODUCT_VARIANTS,
  REQUEST_PRODUCT_OPTIONS,
  RECEIVE_PRODUCT_OPTIONS,
  ERROR_PRODUCT_OPTIONS,
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
  SET_PRODUCT_ID,
  SET_PRODUCT_VARIANT_ID,
  SET_PRODUCT_QUANTITY,
  SET_PRODUCT_OPTION,
  RESET_CURRENT_PRODUCT,
} from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT action object.
 * @param {string} productId The ID of the product to request.
 * @return {Object} The REQUEST_PRODUCT action.
 */
export const requestProduct = productId => ({
  type: REQUEST_PRODUCT,
  productId,
});

/**
 * Creates the dispatched RECEIVE_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @param {Object} productData The data of the received product.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
export const receiveProduct = (productId, productData) => ({
  type: RECEIVE_PRODUCT,
  productId,
  productData,
});

/**
 * Dispatches the ERROR_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @return {Object} The ERROR_PRODUCT action.
 */
export const errorProduct = productId => ({
  type: ERROR_PRODUCT,
  productId,
});

/**
 * Creates the dispatched REQUEST_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {string} params The criteria of the products to request.
 * @return {Object} The REQUEST_PRODUCTS action.
 */
export const requestProducts = payload => ({
  type: REQUEST_PRODUCTS,
  ...payload,
});

/**
 * Creates the dispatched RECEIVE_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {Object} payload.products The data of the received products.
 * @param {boolean} payload.cached If the result should be cached.
 * @return {Object} The RECEIVE_PRODUCTS action.
 */
export const receiveProducts = payload => ({
  type: RECEIVE_PRODUCTS,
  ...payload,
});

/**
 * Dispatches the ERROR_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @return {Object} The ERROR_PRODUCTS action.
 */
export const errorProducts = payload => ({
  type: ERROR_PRODUCTS,
  ...payload,
});

/**
 * Dispatches the REQUEST_PRODUCT_IMAGES action.
 * @param {string} productId The ID of the product to request the images.
 * @return {Object} The REQUEST_PRODUCT_IMAGES action.
 */
export const requestProductImages = productId => ({
  type: REQUEST_PRODUCT_IMAGES,
  productId,
});

/**
 * Creates the dispatched RECEIVE_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} productImages List of product images.
 * @return {Object} The RECEIVE_PRODUCT_IMAGES action.
 */
export const receiveProductImages = (productId, productImages) => ({
  type: RECEIVE_PRODUCT_IMAGES,
  productId,
  productImages,
});

/**
 * Dispatches the ERROR_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @return {Object} The ERROR_PRODUCT_IMAGES action.
 */
export const errorProductImages = productId => ({
  type: ERROR_PRODUCT_IMAGES,
  productId,
});

/**
 * Creates the dispatched REQUEST_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that requests description.
 * @return {Object} The REQUEST_PRODUCT_DESCRIPTION action.
 */
export const requestProductDescription = productId => ({
  type: REQUEST_PRODUCT_DESCRIPTION,
  productId,
});

/**
 * Creates the dispatched RECEIVE_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that received description.
 * @param {string} description The description for the product.
 * @return {Object} The RECEIVE_PRODUCT_DESCRIPTION action.
 */
export const receiveProductDescription = (productId, description) => ({
  type: RECEIVE_PRODUCT_DESCRIPTION,
  productId,
  description,
});

/**
 * Dispatches the ERROR_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that received description.
 * @return {Object} The ERROR_PRODUCT_DESCRIPTION action.
 */
export const errorProductDescription = productId => ({
  type: ERROR_PRODUCT_DESCRIPTION,
  productId,
});

/**
 * Creates the dispatched REQUEST_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that requests properties.
 * @return {Object} The REQUEST_PRODUCT_PROPERTIES action.
 */
export const requestProductProperties = productId => ({
  type: REQUEST_PRODUCT_PROPERTIES,
  productId,
});

/**
 * Creates the dispatched RECEIVE_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that received properties.
 * @param {Object} properties Key-value list of properties.
 * @return {Object} The RECEIVE_PRODUCT_PROPERTIES action.
 */
export const receiveProductProperties = (productId, properties) => ({
  type: RECEIVE_PRODUCT_PROPERTIES,
  productId,
  properties,
});

/**
 * Dispatches the ERROR_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that received properties.
 * @return {Object} The ERROR_PRODUCT_PROPERTIES action.
 */
export const errorProductProperties = productId => ({
  type: ERROR_PRODUCT_PROPERTIES,
  productId,
});

/**
 * Dispatches the REQUEST_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @return {Object} The REQUEST_PRODUCT_SHIPPING action.
 */
export const requestProductShipping = productId => ({
  type: REQUEST_PRODUCT_SHIPPING,
  productId,
});

/**
 * Dispatches the RECEIVE_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @param {Object} shipping The data of the received product shipping.
 * @return {Object} The RECEIVE_PRODUCT_SHIPPING action.
 */
export const receiveProductShipping = (productId, shipping) => ({
  type: RECEIVE_PRODUCT_SHIPPING,
  productId,
  shipping,
});

/**
 * Dispatches the ERROR_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @return {Object} The ERROR_PRODUCT_SHIPPING action.
 */
export const errorProductShipping = productId => ({
  type: ERROR_PRODUCT_SHIPPING,
  productId,
});

/**
 * Dispatches the REQUEST_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @return {Object} The REQUEST_PRODUCT_VARIANTS action.
 */
export const requestProductVariants = productId => ({
  type: REQUEST_PRODUCT_VARIANTS,
  productId,
});

/**
 * Dispatches the RECEIVE_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @param {Object} variants The data of the received product variants.
 * @return {Object} The RECEIVE_PRODUCT_VARIANTS action.
 */
export const receiveProductVariants = (productId, variants) => ({
  type: RECEIVE_PRODUCT_VARIANTS,
  productId,
  variants,
});

/**
 * Dispatches the ERROR_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @return {Object} The ERROR_PRODUCT_VARIANTS action.
 */
export const errorProductVariants = productId => ({
  type: ERROR_PRODUCT_VARIANTS,
  productId,
});

/**
 * Dispatches the REQUEST_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object} The REQUEST_PRODUCT_OPTIONS action.
 */
export const requestProductOptions = productId => ({
  type: REQUEST_PRODUCT_OPTIONS,
  productId,
});

/**
 * Dispatches the RECEIVE_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @param {Object} options The data of the received product options.
 * @return {Object} The RECEIVE_PRODUCT_OPTIONS action.
 */
export const receiveProductOptions = (productId, options) => ({
  type: RECEIVE_PRODUCT_OPTIONS,
  productId,
  options,
});

/**
 * Dispatches the ERROR_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object} The ERROR_PRODUCT_OPTIONS action.
 */
export const errorProductOptions = productId => ({
  type: ERROR_PRODUCT_OPTIONS,
  productId,
});

/**
 * Creates the dispatched SET_PRODUCT_ID action object.
 * @param {string|null} productId The product id.
 * @returns {Object} The dispatched action object.
 */
export const setProductId = productId => ({
  type: SET_PRODUCT_ID,
  productId,
});

/**
 * Creates the dispatched SET_PRODUCT_VARIANTS_ID action object.
 * @param {string|null} productVariantId The product variant id.
 * @returns {Object} The dispatched action object.
 */
export const setProductVariantId = productVariantId => ({
  type: SET_PRODUCT_VARIANT_ID,
  productVariantId,
});

/**
 * Creates the dispatched SET_PRODUCT_QUANTITY action object.
 * @param {number} quantity The product variant id.
 * @returns {Object} The dispatched action object.
 */
export const setProductQuantity = quantity => ({
  type: SET_PRODUCT_QUANTITY,
  quantity,
});

/**
 * Dispatches the SET_PRODUCT_OPTION action.
 * @param {string} optionId The ID of the option.
 * @param {string} valueId The ID of the selected value.
 * @return {Object} The SET_PRODUCT_OPTIONS action.
 */
export const setProductOption = (optionId, valueId) => ({
  type: SET_PRODUCT_OPTION,
  optionId,
  valueId,
});

/**
 * Dispatches the RESET_CURRENT_PRODUCT action.
 * @return {Object} The RESET_CURRENT_PRODUCT action.
 */
export const resetCurrentProduct = () => ({
  type: RESET_CURRENT_PRODUCT,
});

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS action
 * @param {string} productId The ID of the product
 * @param {number} limit The max number of reviews
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action
 */
export const requestProductReviews = (productId, limit) => ({
  type: REQUEST_PRODUCT_REVIEWS,
  productId,
  limit,
});

/**
 * Dispatches the RECEIVE_PRODUCT_REVIEWS action
 * @param {string} productId The ID of the product
 * @param {Object} reviews The received review data
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action
 */
export const receiveProductReviews = (productId, reviews, totalReviewCount) => ({
  type: RECEIVE_PRODUCT_REVIEWS,
  productId,
  reviews,
  totalReviewCount,
});

/**
 * Dispatches the ERROR_PRODUCT_REVIEWS action
 * @param {string} productId The ID of the product
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action
 */
export const errorProductReviews = productId => ({
  type: ERROR_PRODUCT_REVIEWS,
  productId,
});
