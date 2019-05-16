import { createSelector } from 'reselect';
import { getProductPriceData } from '@shopgate/pwa-common-commerce/product';

/**
 * Return product price.mapPricing.
 * @param {Object} state The current application state.
 * @returns {boolean}
 */
export const getProductMapPrice = createSelector(
  getProductPriceData,
  (price) => {
    if (!price) {
      return null;
    }
    return price.mapPricing || null;
  }
);
