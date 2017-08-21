import { getCurrentBaseProduct } from '../selectors/product';

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
