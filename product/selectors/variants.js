import {
  getCurrentBaseProduct,
  getCurrentBaseProductId,
} from '../selectors/product';

/**
 * Selects collection of all stored product variants from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of product variants.
 */
const getVariants = state => state.product.variantsByProductId;

/**
 * Gets the id of the currently selected product variant.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getCurrentProductVariantId = state => state.currentProduct.productVariantId;

/**
 * Checks if the current product has variants.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasCurrentProductVariants = (state) => {
  const product = getCurrentBaseProduct(state);
  if (!product) {
    return false;
  }

  return product.flags.hasVariants;
};

/**
 * Checks if the children for the current product is selected.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isProductChildrenSelected = state => !!getCurrentProductVariantId(state);

/**
 * Retrieves product variants by product ID from state.
 * @param {Object} state The current application state.
 * @param {string} id The product ID.
 * @return {Object|null} The dedicated variants. Or null when the requested data is unavailable.
 */
export const getVariantsByProductId = (state, id) => {
  const variants = getVariants(state);

  if (!variants || !variants[id] || variants[id].isFetching === true) {
    return null;
  }

  return variants;
};

/**
 * Retrieves product variants for the currently selected base product from state.
 * @param {Object} state The current application state.
 * @return {Object|null} The dedicated variants. Or null when the requested data is unavailable.
 */
export const getCurrentBaseProductVariants = (state) => {
  const baseProductId = getCurrentBaseProductId(state);
  return getVariantsByProductId(state, baseProductId);
};
