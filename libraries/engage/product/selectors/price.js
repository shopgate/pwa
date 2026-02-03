import { createSelector } from 'reselect';
import { getProductPriceData } from '@shopgate/pwa-common-commerce/product';

/**
 * Creates the selector to get a product's price.
 * @returns {Function}
 */
export function makeGetProductPriceData() {
  // The underlying getProductPriceData is already a selector; we can return it directly
  // instead of wrapping it in another createSelector that simply returns its input.
  return getProductPriceData;
}

/**
 * Creates the selector to get a product's map pricing.
 * @returns {Function}
 */
export function makeGetProductMapPrice() {
  return createSelector(
    getProductPriceData,
    (price) => {
      if (!price) {
        return null;
      }
      if (!price.mapPricing) {
        return null;
      }
      // mapPricing can be array or pojo. force it to pojo
      return [].concat(price.mapPricing)[0];
    }
  );
}

