import {
  getCurrentBaseProduct,
  getCurrentProduct,
} from './product';
import {
  hasCurrentProductVariants,
  getCurrentBaseProductVariants,
  getCurrentProductVariantId,
} from './variants';

/**
 * Checks, if the products of the product page are loading. Depending on the configuration of the
 * base product, it also checks, if the loading process of a selected variant is currently ongoing.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isProductPageLoading = (state) => {
  const baseProduct = getCurrentBaseProduct(state);

  // Check if the base product is already present.
  if (!baseProduct) {
    return true;
  }

  const hasVariants = hasCurrentProductVariants(state);

  // Check if the base product has variants.
  if (hasVariants) {
    const variantsPresent = !!getCurrentBaseProductVariants(state);

    // Check if the variant list is already present.
    if (!variantsPresent) {
      return true;
    }

    const variantSelected = !!getCurrentProductVariantId(state);

    // Check if one of the variants is currently selected by the user.
    if (variantSelected) {
      // Check if the product data of the selected variant is already present.
      return !getCurrentProduct(state);
    }
  }

  return false;
};

/**
 * Checks, if the product page is currently in a state, that a product can be ordered.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isProductPageOrderable = (state) => {
  const baseProduct = getCurrentBaseProduct(state);

  // Check if the base product is already present.
  if (!baseProduct) {
    return false;
  }

  const hasVariants = hasCurrentProductVariants(state);

  // Check if the base product has variants.
  if (hasVariants) {
    const variantsPresent = !!getCurrentBaseProductVariants(state);

    // Check if the variant list is already present.
    if (!variantsPresent) {
      return false;
    }

    const variantSelected = !!getCurrentProductVariantId(state);

    // Check if one of the variants is currently selected by the user.
    if (variantSelected) {
      // Check if the product data of the selected variant is already present.
      return !!getCurrentProduct(state);
    }

    return false;
  }

  return true;
};
