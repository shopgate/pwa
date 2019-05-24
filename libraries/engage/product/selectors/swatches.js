import { createSelector } from 'reselect';
import { getProductDataById } from '@shopgate/pwa-common-commerce/product';

/**
 * Creates a selector to return product swatches.
 * @param {Object} state The current application state.
 * @returns {Function}
 */
export function makeGetProductSwatches() {
  return createSelector(
    getProductDataById,
    // filter by and return swatch characteristics
    product => (!product.characteristics ? [] : product.characteristics.filter(c => c.swatch))
  );
}
