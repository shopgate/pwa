import { createSelector } from 'reselect';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  getProduct,
  getProducts,
  getProductById,
  getProductVariants,
  hasBaseProductVariants,
} from './product';

/**
 * Gets the variant id out of the props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {string|null}
 */
export const getVariantId = (state, props) => {
  if (typeof props === 'undefined') {
    /**
     * Before PWA 6.0 the variant selectors relied on a "currentProduct" state which doesn't exist
     * anymore. Their successors require a props object which contains a variantId.
     * To support debugging an error will be logged, if the props are missing at invocation.
     */
    logger.error('getVariantId() needs to be called with a props object that includes a variantId.');
  }

  const { variantId = null } = props || {};

  return variantId;
};

/**
 * Checks if currently a variant is selected. It checks if the props contain a variantId.
 * For determination the props need to include a variantId.
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
  getProduct,
  isVariantSelected,
  (product, selected) => {
    if (!product || !selected) {
      return null;
    }

    return product;
  }
);

/**
 * Retrieves the metadata from the product data within the variants.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getSelectedVariantMetadata = createSelector(
  getProductVariants,
  getSelectedVariant,
  getVariantId,
  (variants, variant, variantId) => {
    if (!variants && !variant) {
      return null;
    }
    // Prefer variant data, if available
    if (variants && variantId !== null) {
      // Get the product data of the selected product from the variants.
      const { metadata } = variants.products.find(({ id }) => id === variantId) || {};

      if (metadata) {
        return metadata;
      }
    }

    // Check if variant data is available in product list
    // istanbul ignore else
    if (variant) {
      return variant.metadata || null;
    }
    /**
     * This statement should never be reached since getProductVariants will not return data when the
     * variant product entity can't be found to determine a baseProductId.
     */

    // istanbul ignore next
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
export const hasCurrentProductVariants = hasBaseProductVariants;
export const isProductChildrenSelected = isVariantSelected;
export const getVariantsByProductId = getProductVariants;
export const getBaseProductVariants = getProductVariants;
export { getProductVariants } from './product';
