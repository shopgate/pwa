import { createSelector } from 'reselect';
import { logDeprecationMessage } from '@shopgate/pwa-core/helpers';

import {
  getProduct,
  getBaseProduct,
  hasBaseProductVariants,
  getVariantProductId,
  getProductVariants,
} from './product';

/**
 * Checks, if the products of the product page are loading. Depending on the configuration of the
 * base product, it also checks, if the loading process of a selected variant is currently ongoing.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const isProductPageLoading = createSelector(
  getBaseProduct,
  hasBaseProductVariants,
  getProductVariants,
  getVariantProductId,
  getProduct,
  (baseProduct, hasVariants, variants, variantId, product) => {
    // Check if the base product is already present.
    if (!baseProduct) {
      return true;
    }

    // Check if the base product has variants.
    if (hasVariants) {
      const variantsFetching = !variants;

      // Check if the variant list is currently fetching.
      if (variantsFetching) {
        return true;
      }

      const variantSelected = !!variantId;
      // Check if one of the variants is currently selected by the user.
      if (variantSelected) {
        // Check if the product data of the selected variant is already present.
        return !product;
      }
    }

    return false;
  }
);

/**
 * Checks, if the product page is currently in a state, that a product can be ordered.
 * @todo Consider the real orderable state of the products.
 * @param {Object} state The application state.
 * @return {boolean}
 * @deprecated
 */
export const isProductPageOrderable = createSelector(
  getBaseProduct,
  hasBaseProductVariants,
  getProductVariants,
  getVariantProductId,
  getProduct,
  (baseProduct, hasVariants, variants, variantId, product) => {
    logDeprecationMessage('The selector isProductPageOrderable()');
    // Check if the base product is already present.
    if (!baseProduct) {
      return false;
    }

    // Check if the base product has variants.
    if (hasVariants) {
      const variantsFetching = !variants;

      // Check if the variant list is currently fetching.
      if (variantsFetching) {
        return false;
      }

      const variantSelected = !!variantId;
      // Check if one of the variants is currently selected by the user.
      if (variantSelected) {
        // Check if the product data of the selected variant is already present.
        return !!product;
      }

      return false;
    }

    return true;
  }
);
