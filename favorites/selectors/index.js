/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { createSelector } from 'reselect';
import {
  getProductsWithCharacteristics,
  getProducts,
} from '../../product/selectors/product';

/**
 * Gets favorite products ids.
 * @param {Object} state State.
 * @returns {Array}
 */
export const getFavoritesProductsIds = (state) => {
  if (
    state.favorites
    && state.favorites.products
    && state.favorites.products.ids
  ) {
    return state.favorites.products.ids;
  }
  return [];
};

/**
 * Favorites selector.
 */
export const getFavorites = createSelector(
  getFavoritesProductsIds,
  getProductsWithCharacteristics,
  (productIds, products) => productIds.map((id) => {
    const { productData } = products[id];
    return {
      ...productData,
    };
  })
);

/**
 * Selects `baseProductIds` or product `ids` when `baseProductId` is not available.
 */
export const getFavoritesBaseProductIds = createSelector(
  getFavoritesProductsIds,
  getProducts,
  (productIds, products) => {
    const baseProductIds = [];
    productIds.forEach((id) => {
      if (!products[id]) {
        return;
      }
      const { productData } = products[id];
      baseProductIds.push(productData.baseProductId || productData.id);
    });

    return baseProductIds;
  }
);

/**
 * True when favorites where not yet fetched for the first time.
 * @param {Object} state State.
 * @returns {bool}
 */
export const isInitialLoading = state => !(
  state.favorites
  && state.favorites.products.ready
);
/**
 * Gets favorites list count.
 */
export const getFavoritesCount = createSelector(
  getFavoritesProductsIds,
  ids => ids.length
);

/**
 * Returns true when favorites list is not empty.
 */
export const hasFavorites = createSelector(
  getFavoritesCount,
  count => !!count
);
