import { createSelector } from 'reselect';
import {
  getProducts,
  getProductId,
} from '../../product/selectors/product';
import { getKnownRelatives } from '../../product/selectors/variants';

const defaultIds = [];

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getFavoritesState = state => state.favorites || {};

/**
 * @param {Object} state The global state.
 * @return {Object|null}
 */
export const getFavoritesProducts = createSelector(
  getFavoritesState,
  (state) => {
    if (!state.products) {
      return null;
    }

    return state.products;
  }
);

/**
 * @param {Object} state The global state.
 * @returns {Array}
 */
export const getFavoritesProductsIds = createSelector(
  getFavoritesProducts,
  (products) => {
    if (!products || !products.ids) {
      return defaultIds;
    }

    return products.ids;
  }
);

/**
 * @param {Object} state The global state.
 */
export const getFavorites = createSelector(
  getFavoritesProductsIds,
  getProducts,
  (productIds, products) => productIds
    .filter(id => !!products[id] && products[id].productData)
    .map(id => products[id].productData)
);

/**
 * True when favorites where not yet fetched for the first time.
 * @param {Object} state The global state.
 * @returns {boolean}
 */
export const isInitialLoading = createSelector(
  getFavoritesProducts,
  (products) => {
    if (!products) {
      return true;
    }

    return !products.ready;
  }
);

/**
 * @param {Object} state The global state.
 * @return {number}
 */
export const getFavoritesCount = createSelector(
  getFavoritesProductsIds,
  ids => ids.length
);

/**
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const hasFavorites = createSelector(
  getFavoritesCount,
  count => !!count
);

/**
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isFetching = createSelector(
  getFavoritesProducts,
  (products) => {
    if (!products) {
      return false;
    }

    return products.isFetching;
  }
);

/**
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isCurrentProductOnFavoriteList = createSelector(
  getProductId,
  getFavoritesProductsIds,
  (productId, ids) => ids.indexOf(productId) !== -1
);

/**
 * Returns all relatives which are on favorites.
 * @param {Object} state Current state.
 * @param {string} productId
 * @returns {Array}
 */
export const getProductRelativesOnFavorites = createSelector(
  getKnownRelatives,
  getFavoritesProductsIds,
  (productRelativesIds, favoriteIds) => productRelativesIds.filter(id => favoriteIds.includes(id))
);
/**
 * Checks if product or any relative is on favorires list.
 * @param {Object} state Current state.
 * @param {string} productId Product id.
 * @return {boolean}
 */
export const isRelativeProductOnList = createSelector(
  getProductRelativesOnFavorites,
  relativesOnFavorites => relativesOnFavorites.length > 0
);
