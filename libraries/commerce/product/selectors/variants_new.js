import { createSelector } from 'reselect';
import {
  getProduct,
  getProducts,
  getProductById,
  getProductVariants,
  hasVariants,
} from './product';

/**
 * Gets the variant id out of the props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {string|null}
 */
export const getVariantId = (state, { variantId = null } = {}) => variantId;

/**
 * Checks if a variant is currently selected.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {boolean}
 */
export const isVariantSelected = (state, props) => !!getVariantId(state, props);

/**
 * Retrieves a product for the selected variantId from the store.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {Object|null} The selected variant or null if none is selected
 */
export const getSelectedVariant = createSelector(
  getVariantId,
  state => state,
  (variantId, state) => {
    if (!variantId) {
      return null;
    }

    return getProduct(state, { productId: variantId });
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
    const product = getProductById(state, { variantId });
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

/**
 * Fallbacks to the selector names < PWA 6.0
 */
export const getCurrentProductVariantId = getVariantId;
export const hasCurrentProductVariants = hasVariants;
export const isProductChildrenSelected = isVariantSelected;
export const getVariantsByProductId = getProductVariants;
export const getBaseProductVariants = getProductVariants;
export { getProductVariants } from './product';
