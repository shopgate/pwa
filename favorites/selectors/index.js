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
  (productIds, products) => productIds
    .filter(id => !!products[id] && products[id].productData)
    .map((id) => {
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

/**
 * Returns true if state is being updated.
 * @param {Object} state State.
 * @return {boolean}
 */
export const isFetching = state => state.favorites.products.isFetching;
/**
 * Returns true when the current product is on the favorites list
 */
export const isCurrentProductOnFavoriteList = createSelector(
  getCurrentProductId,
  getFavoritesProductsIds,
  (productId, ids) => ids.indexOf(productId) !== -1
);

/**
 * Checks if product is on favorires list.
 * @param {Object} state Current state.
 * @param {number} productId Product id.
 * @return {boolean}
 */
export const isProductOnList = (state, productId) =>
  getFavoritesProductsIds(state).includes(productId);
