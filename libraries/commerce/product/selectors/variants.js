import { createSelector } from 'reselect';
import {
  getCurrentBaseProductId,
  getCurrentBaseProduct,
  getProductById,
  getProducts,
} from './product';

/**
 * Selects collection of all stored product variants from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of product variants.
 */
export const getVariantsState = state => state.product.variantsByProductId;

/**
 * Gets the id of the currently selected product variant.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getCurrentProductVariantId = createSelector(
  state => state.product,
  (productState) => {
    if (
      !productState
      || !productState.currentProduct
      || !productState.currentProduct.productVariantId
    ) {
      return null;
    }

    return productState.currentProduct.productVariantId;
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
export const getVariantsByProductId = createSelector(
  getVariantsState,
  (state, props, productId) => productId,
  (variants, productId) => {
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

/**
 * Retrieves the current product variants.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const getProductVariants = createSelector(
  getCurrentBaseProductVariants,
  (variants) => {
    if (!variants) {
      return null;
    }

    return variants.variants;
  }
);

/**
 * Retrieves the current selected product variant.
 * @param {Object} state The application state.
 * @returns {Object|null} The selected variant or null if none is selected
 */
export const getSelectedVariant = createSelector(
  getCurrentProductVariantId,
  state => state,
  (variantId, state) => {
    if (!variantId) {
      return null;
    }

    const product = getProductById(state, variantId);

    if (product) {
      return product.productData;
    }

    return null;
  }
);

/**
 * Retrieves the metadata from the product data within the variants.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getSelectedVariantMetadata = createSelector(
  getProductVariants,
  (state, productId, variantId) => variantId,
  state => state,
  (variants, variantId, state) => {
    if (!variantId) {
      return null;
    }

    // Prefer variant data, if available
    if (variants) {
      // Get the product data of the selected product from the variants.
      const productData = variants.products.find(({ id }) => id === variantId);

      if (productData) {
        return productData.metadata || null;
      }
    }

    // Check if variant data is available in product list
    const product = getProductById(state, variantId);
    if (product && product.productData.metadata) {
      return product.productData.metadata || null;
    }

    return null;
  }
);

/**
 * Matches all products relatives which are already fetched and stored in redux.
 * If this ever would be too slow, the calculation should happen in the reducer.
 * @param {Object} state Current state.
 * @returns {Object}
 */
export const getKnownProductRelatives = createSelector(
  [getProducts],
  (products) => {
    const relativesByBaseProductId = {};
    Object.keys(products).forEach((id) => {
      if (!products[id].productData) {
        // It's possible that product has no data yet. Skip it then.
        return;
      }
      const { productData } = products[id];
      let parentId = productData.id;
      if (productData.baseProductId) {
        parentId = productData.baseProductId;
      }
      if (!relativesByBaseProductId[parentId]) {
        relativesByBaseProductId[parentId] = [];
      }
      relativesByBaseProductId[parentId].push(productData.id);
      if (
        parentId !== productData.id
        && !relativesByBaseProductId[parentId].includes(parentId)
      ) {
        relativesByBaseProductId[parentId].push(parentId);
      }
    });
    return relativesByBaseProductId;
  }
);
/**
 * Returns relatives which are already fetched into a client app for given product id.
 * @param {Object} state Current state.
 * @param {string} productId Product id.
 * @returns {Array}
 */
export const getKnownRelatives = createSelector(
  getProductById,
  getKnownProductRelatives,
  (product, knownRelations) => {
    const { productData } = product;
    let parentId = productData.id;
    // Product is parent.
    if (productData.flags.hasVariants) {
      parentId = productData.id;
    } else if (productData.baseProductId) {
      parentId = productData.baseProductId;
    }

    return knownRelations[parentId] || [];
  }
);
