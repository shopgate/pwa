import { createSelector } from 'reselect';
import {
  getBaseProduct,
  getProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
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
