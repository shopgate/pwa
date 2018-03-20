import { createSelector } from 'reselect';
import { getSelectedVariant } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import { getCurrentBaseProduct, getCurrentProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { formatProductData } from '../helpers';

/**
 * Gets the current selected Variant in a formatted way.
 * @param {Object} state The current state.
 * @returns {Object} The formatted selected variant.
 */
export const getSelectedVariantFormatted = createSelector(
  getSelectedVariant,
  formatProductData
);

/**
 * Gets the current base product in a formatted way.
 * @param {Object} state The current state.
 * @returns {Object} The formatted selected variant.
 */
export const getCurrentBaseProductFormatted = createSelector(
  getCurrentBaseProduct,
  formatProductData
);

/**
 * Gets the current product in a formatted way.
 * @param {Object} state The current state.
 * @returns {Object} The formatted selected variant.
 */
export const getCurrentProductFormatted = createSelector(
  getCurrentProduct,
  formatProductData
);

