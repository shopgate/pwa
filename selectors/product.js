/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { getSelectedVariant } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import { getCurrentBaseProduct, getCurrentProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Re-format a given product form the store.
 * @param {Object} productData The product data from the store
 * @returns {Object|null} The formatted product.
 */
export const formatProductData = (productData) => {
  if (!productData) {
    return null;
  }

  return {
    uid: productData.id,
    name: productData.name,
    amount: {
      net: productData.price.unitPriceNet,
      gross: productData.price.unitPriceWithTax,
      currency: productData.price.currency,
    },
  };
};

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

