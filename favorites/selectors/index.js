/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { createSelector } from 'reselect';
import {
  getProductPropertiesState,
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
  getProducts,
  getProductPropertiesState,
  (productIds, products, propertiesByProduct) => productIds.map((id) => {
    const { productData } = products[id];
    const properties = propertiesByProduct[id] ? propertiesByProduct[id].properties : undefined;

    return {
      ...productData,
      properties,
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
