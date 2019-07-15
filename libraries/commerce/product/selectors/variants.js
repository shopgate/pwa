import { createSelector } from 'reselect';
import {
  getProducts,
  getProductById,
  getProductVariants,
  hasBaseProductVariants,
  isVariantSelected,
  getSelectedVariant,
  getVariantProductId,
} from './product';

/**
 * Retrieves the metadata from the product data within the variants.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getSelectedVariantMetadata = createSelector(
  getProductVariants,
  getSelectedVariant,
  getVariantProductId,
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
      return variant.metadata;
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
    if (!product) {
      return [];
    }

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
 * Selector mappings for PWA < 6.0
 * @deprecated
 */
export const getCurrentProductVariantId = getVariantProductId;
export const hasCurrentProductVariants = hasBaseProductVariants;
export const isProductChildrenSelected = isVariantSelected;
export const getVariantsByProductId = getProductVariants;
export const getCurrentBaseProductVariants = getProductVariants;
