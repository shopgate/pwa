/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { createSelector } from 'reselect';
import { getProducts } from '../../product/selectors/product';

/**
 * Gets favorite products ids.
 * @param {Object} state State.
 * @returns {Array}
 */
const getFavoritesProductsIds = state => state.favorites.products.ids;

/**
 * Favorites selector.
 */
export const getFavorites = createSelector(
  getFavoritesProductsIds,
  getProducts,
  (productIds, products) => productIds.map(id => products[id])
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
