/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getSortOrder, getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getActiveFilters } from '../../filter/selectors';
import { getCurrentCategoryId } from '../../category/selectors';

/**
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = state => state.product.productsById;

/**
 * Retrieves the current product for the detail page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current product.
 */
export const getCurrentProductId = state =>
  state.product.currentProduct.productVariantId || state.product.currentProduct.productId;

/**
 * Retrieves a product by ID from state.
 * @param {Object} state The current application state.
 * @param {string} id The product ID.
 * @return {Object} The dedicated product.
 */
export const getProductById = (state, id) => getProducts(state)[id];

/**
 * Retrieves the current base product for the detail page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current base product.
 */
export const getCurrentBaseProductId = state => state.product.currentProduct.productId;

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
 * Retrieves the current product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentProduct = createSelector(
  getProducts,
  getCurrentProductId,
  (products, productId) => {
    if (!products[productId] || products[productId].isFetching) {
      return null;
    }
    return products[productId].productData;
  }
);

/**
 * Retrieves the base price from a product.
 * @param {Object} state The application state.
 * @returns {number|null}
 */
export const getProductBasePrice = (state) => {
  const currentProduct = getCurrentProduct(state);
  if (!currentProduct) {
    return null;
  }

  return currentProduct.price.unitPrice;
};

/**
 * Retrieves the price currency from a product.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getProductCurrency = (state) => {
  const currentProduct = getCurrentProduct(state);
  if (!currentProduct) {
    return null;
  }

  return currentProduct.price.currency;
};

/**
 * Retrieves the generated result hash for a category ID.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {string} The result hash.
 */
const getResultHash = createSelector(
  getCurrentCategoryId,
  getSearchPhrase,
  getSortOrder,
  getActiveFilters,
  (categoryId, searchPhrase, sort, filters) => {
    if (categoryId) {
      return generateResultHash({
        categoryId,
        sort,
        ...filters && { filters },
      });
    }

    if (searchPhrase) {
      return generateResultHash({
        searchPhrase,
        sort,
        ...filters && { filters },
      });
    }

    return null;
  }
);

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  state => state.product,
  getResultHash,
  (productState, hash) => productState.resultsByHash[hash]
);

/**
 * Populates the product result object.
 * @param {Object} state The application state.
 * @param {string} hash The result hash.
 * @param {Object} result The result.
 * @return {Object} The product result.
 */
export const getPopulatedProductsResult = (state, hash, result) => {
  const sort = getSortOrder(state);
  let products = [];
  let totalProductCount = !hash ? 0 : null;

  if (result && result.products) {
    totalProductCount = result.totalResultCount;
    products = result.products.map(id => getProductById(state, id).productData);
  }

  return {
    products,
    totalProductCount,
    sort,
  };
};

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The product result.
 */
export const getProductsResult = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

/**
 * Retrieves the current product name.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductName = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.name;
  }
);

/**
 * Selects the product images state.
 * @param {Object} state The current application state.
 * @return {Object} The product images state.
 */
const getProductImagesState = state => state.product.imagesByProductId;

/**
 * Retrieves the current product images.
 * @param {Object} state The current application state.
 * @return {Array|null}
 */
export const getProductImages = createSelector(
  getCurrentProductId,
  getProductImagesState,
  (productId, productImagesState) => {
    const collection = productImagesState[productId];

    if (!collection || !collection.images) {
      return null;
    }

    return collection.images;
  }
);

/**
 * Retrieves the current product rating.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductRating = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.rating;
  }
);

/**
 * Retrieves the current product manufacturer.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductManufacturer = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.manufacturer;
  }
);

/**
 * Selects the product shipping state.
 * @param {Object} state The current application state.
 * @return {Object} The product shipping state.
 */
const getProductShippingState = state => state.product.shippingByProductId;

/**
 * Retrieves the current product shipping data.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductShipping = createSelector(
  getCurrentProductId,
  getProductShippingState,
  (productId, productShippingState) => {
    const collection = productShippingState[productId];

    if (!collection || !collection.shipping) {
      return null;
    }

    return collection.shipping;
  }
);

/**
 * Retrieves the current product availability.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductAvailability = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.availability;
  }
);

/**
 * Selects the product description state.
 * @param {Object} state The current application state.
 * @return {Object} The product description state.
 */
const getProductDescriptionState = state => state.product.descriptionsByProductId;

/**
 * Retrieves the current product description.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductDescription = createSelector(
  getCurrentProductId,
  getProductDescriptionState,
  (productId, productDescriptionState) => {
    const collection = productDescriptionState[productId];

    if (!collection || !collection.description) {
      return '';
    }

    return collection.description;
  }
);

/**
 * Selects the product properties state.
 * @param {Object} state The current application state.
 * @return {Object} The product properties state.
 */
const getProductPropertiesState = state => state.product.propertiesByProductId;

/**
 * Retrieves the current product properties.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductProperties = createSelector(
  getCurrentProductId,
  getProductPropertiesState,
  (productId, propertiesState) => {
    const collection = propertiesState[productId];

    if (!collection || !collection.properties) {
      return null;
    }

    return collection.properties;
  }
);
