/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { createSelector } from 'reselect';
import {
  getProducts,
  getCurrentProductId,
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
  getProducts,
  (productIds, products) => productIds.map((id) => {
    if (!products[id]) {
      return {};
    }
    const { productData } = products[id];
    return {
      ...productData,
    };
  })
);

/**
 * True when favorites where not yet fetched for the first time.
 * @param {Object} state State.
 * @returns {bool}
 */
export const isInitialLoading = state => !(
  state.favorites
  && state.favorites.products
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

export const isCurrentProductOnFavoriteList = createSelector(
  getCurrentProductId,
  getFavoritesProductsIds,
  (productId, ids) => ids.indexOf(productId) !== -1
);
