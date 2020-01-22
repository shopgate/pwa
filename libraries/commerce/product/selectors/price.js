import { createSelector } from 'reselect';
import { validateSelectorParams } from '@shopgate/pwa-common/helpers/data';
import {
  getProduct,
  getProductUnitPrice,
  hasBaseProductVariants,
  isVariantSelected,
} from './product';
import {
  getRawProductOptions,
  hasProductOptions,
  areProductOptionsSet,
} from './options';

/**
 * Calculates the additional price for the current product.
 * @param {Object} state The application state.
 * @returns {number}
 */
export const getProductPriceAddition = createSelector(
  (state, props = {}) => props.options,
  getRawProductOptions,
  validateSelectorParams(
    (options, productOptions) => Object.keys(options).map((optionId) => {
      const itemId = options[optionId];
      const productOption = productOptions.find(item => item.id === optionId);

      if (productOption.type === 'select') {
        const optionItems = productOptions.find(item => item.id === optionId).values;
        return optionItems.find(item => item.id === itemId).unitPriceModifier;
      }

      if (productOption.type === 'text' && itemId) {
        return productOption.unitPriceModifier;
      }

      return 0;
    })
      // Sum up all active option item modifiers to calculate the additional price of the product.
      .reduce((a, b) => a + b, 0),
    // If product has no options return 0
    0
  )
);
/**
 * Calculates the total price by summing up additional product option costs.
 * @param {Object} state The application state.
 * @returns {number}
 */
export const getProductTotalPrice = createSelector(
  getProductUnitPrice,
  getProductPriceAddition,
  validateSelectorParams((basePrice, priceAddition) => basePrice + priceAddition)
);

/**
 * Checks if the full price is already available.
 * When a product has variants with different prices the full price is not available.
 * If the children is selected the full price is available.
 * @param {Object} state The application state.
 * @returns {boolean} The product options.
 */
export const isFullPriceAvailable = createSelector(
  hasBaseProductVariants,
  isVariantSelected,
  hasProductOptions,
  areProductOptionsSet,
  (hasVariants, isChildrenSelected, hasOptions, areOptionsSet) => {
    // If product has neither variants nor options the full price is available.
    if (!hasVariants && !hasOptions) {
      return true;
    }

    /**
     * If the product has variants and options,
     * the full price is only available if options and children are set.
     */
    if (hasVariants && hasOptions) {
      return isChildrenSelected && areOptionsSet;
    }

    /**
     * If the product has only options,
     * the full price is only available if the options are set.
     */
    if (!hasVariants && hasOptions) {
      return areOptionsSet;
    }

    /**
     * If the product has only variants,
     * the full price is only available if the children is set.
     */
    if (hasVariants && !hasOptions) {
      return isChildrenSelected;
    }

    return false;
  }
);

/**
 * Retrieves the current product and adds the total price and manipulates the min price
 * to be always 0 when it is not needed.
 * @param {Object} state The application state.
 * @returns {Object} The extended product data.
 */
export const getCalculatedProduct = createSelector(
  getProduct,
  getProductTotalPrice,
  getProductPriceAddition,
  validateSelectorParams((product, totalPrice, addition) => ({
    ...product,
    price: {
      ...product.price,
      modifier: addition,
      totalPrice,
    },
  }))
);

/**
 * Retrieves the current product price data.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductPrice = createSelector(
  getCalculatedProduct,
  (product) => {
    if (!product || !product.price) {
      return null;
    }

    return product.price;
  }
);
