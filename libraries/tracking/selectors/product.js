import { createSelector } from 'reselect';
import {
  getBaseProduct,
  getProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  hex2bin,
  makeGetRouteParam,
  makeGetRoutePattern,
} from '@shopgate/engage/core';
import { ITEM_PATTERN } from '@shopgate/engage/product';
import { formatProductData } from '../helpers';

/**
 * Gets the current base product in a formatted way.
 * @param {Object} state The current state.
 * @returns {Object} The formatted selected variant.
 */
export const getBaseProductFormatted = createSelector(
  getBaseProduct,
  formatProductData
);

/**
 * Gets the current product in a formatted way.
 * @param {Object} state The current state.
 * @returns {Object} The formatted selected variant.
 */
export const getProductFormatted = createSelector(
  getProduct,
  formatProductData
);

/**
 * Creates a selector that retrieves a formatted product for the current route.
 * @returns {Function}
 */
export const makeGetRouteProduct = () => {
  const getRoutePattern = makeGetRoutePattern();
  const getProductIdRouteParam = makeGetRouteParam('productId');

  return createSelector(
    state => state,
    getRoutePattern,
    getProductIdRouteParam,
    (state, pattern, productId) => {
      const decodedProductId = productId ? hex2bin(productId) : null;

      if (pattern === ITEM_PATTERN && decodedProductId) {
        return getProductFormatted(state, { productId: decodedProductId });
      }

      return null;
    }
  );
};
