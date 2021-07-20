import { createSelector } from 'reselect';
import {
  getProductPropertiesState,
  getProductId,
  getProduct,
  getProductDataById,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { filterProperties } from './helpers';

/**
 * Creates the selector to get a product's properties from the state.
 * @returns {Function}
 */
export function makeGetProductProperties() {
  return createSelector(
    getProductPropertiesState,
    getProductId,
    (properties, productId) => {
      const entry = properties[productId];

      if (!entry || !entry.properties) {
        return null;
      }

      return filterProperties(entry.properties);
    }
  );
}

/**
 * Creates the selector to get a product's effectivity dates.
 * @returns {Function}
 */
export function makeGetProductEffectivityDates() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }
      const { startDate, endDate } = product;
      return startDate || endDate
        ? {
          startDate,
          endDate,
        }
        : null;
    }
  );
}

/**
 * Creates a selector to return product characteristics.
 * @returns {Function}
 */
export function makeGetProductCharacteristics() {
  return createSelector(
    getProductDataById,
    product => ((!product || !product.characteristics) ? null : product.characteristics)
  );
}

/**
 * Creates a selector to return product featured media.
 * @returns {Function}
 */
export function makeGetProductFeaturedMedia() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }

      return !product.featuredMedia ? null : product.featuredMedia;
    }
  );
}

/**
 * Retrieves the product state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The product state.
 */
export const getProductState = state => state.product || {};

/**
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = createSelector(
  getProductState,
  state => state.productsById || {}
);

/**
 * Determines a baseProductId for the products which are referenced within the props.
 * When a variantId is passed, the selector will return the id of the related base product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getBaseProductId = createSelector(
  getProduct,
  (_, props = {}) => props.productId,
  (_, props = {}) => props.variantId,
  (product, productId, variantId) => {
    if (!product) {
      // Return the productId when both ids are present, but no variant product is available yet.
      if (typeof productId !== 'undefined' && typeof variantId !== 'undefined') {
        return productId;
      }

      return null;
    }
    // First try to determine a baseProductId for a selected product
    const { baseProductId = null } = product;

    return baseProductId || product.id;
  }
);

/**
 * Retrieves the base product data for the passed productId from the store.
 * @param {Object} state The current application state.
 * @returns {Object|null} The current product.
 */
export const getBaseProduct = createSelector(
  getProducts,
  getBaseProductId,
  (products, baseProductId) => {
    if (!baseProductId) {
      return null;
    }

    const { productData = null } = products[baseProductId] || {};

    return productData;
  }
);

/**
 * Creates a selector to indicate if a product is active.
 * @returns {Function}
 */
export const makeIsProductActive = () => createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return false;
    }

    return product.active || false;
  }
);

/**
 * Creates a selector to indicate if the base product is active.
 * @returns {Function}
 */
export const makeIsBaseProductActive = () => createSelector(
  getBaseProduct,
  (baseProduct) => {
    if (!baseProduct) {
      return false;
    }

    return baseProduct.active || false;
  }
);
