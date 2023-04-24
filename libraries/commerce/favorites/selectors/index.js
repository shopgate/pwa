import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  getProducts,
  getProductId,
} from '../../product/selectors/product';
import { getKnownRelatives } from '../../product/selectors/variants';
import { DEFAULT_FAVORITES_LIST_ID } from '../constants';

const defaultIds = [];

/**
 * Creates a selector to check if the app has support for multiple favorites list.
 * @returns {Function}
 */
export const getHasMultipleFavoritesListsSupport = () =>
  appConfig.favoritesMode.hasMultipleFavoritesLists;

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getFavoritesState = state => state.favorites || {};

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getFavoritesListState = state => state.favorites?.lists || {};

/**
 * Returns a list of available wishlists to the user.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getFavoritesLists = state => getFavoritesListState(state)?.lists || [];

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

export const getFavoritesDefaultList = createSelector(
  getFavoritesLists,
  lists => lists.find(list => list.id === DEFAULT_FAVORITES_LIST_ID)
);

export const hasMultipleFavoritesList = createSelector(
  getFavoritesLists,
  lists => lists.length > 1
);

/**
 * A selector that gets the id of the favorites list by the given name
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {string} the id of the favorites list
 */
export const getFavoritesListIdByName = createSelector(
  getFavoritesLists,
  (state, props) => props.listName,
  (favLists, listName) => {
    const { id } = favLists.find(list => list.name === listName) || {};
    return id;
  }
);

/**
 * @param {Object} state The global state.
 * @returns {Array}
 * @deprecated
 */
export const getFavoritesProductsIds = createSelector(
  getFavoritesProducts,
  (products) => {
    if (!products || !products.byList) {
      return defaultIds;
    }

    return uniq(Object
      .values(products.byList)
      .map(l => l.ids)
      .flat());
  }
);

/**
 * @param {Object} state The global state.
 * @deprecated
 */
export const getFavorites = createSelector(
  getFavoritesProductsIds,
  getProducts,
  (productIds, products) => productIds
    .filter(id => !!products[id] && products[id].productData)
    .map(id => products[id].productData)
);

/**
 * Creates a selector that selects all ids that belong
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavoritesIdsByList = getListCode => createSelector(
  getFavoritesProducts,
  getListCode,
  (favProducts, listId = DEFAULT_FAVORITES_LIST_ID) => {
    const ids = favProducts.byList[listId]?.ids || [];
    return ids;
  }
);

/**
 * Creates a selector that selects all products that belong
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavoritesProductsByList = getListCode => createSelector(
  getFavoritesProducts,
  getListCode,
  (favProducts, listId) => {
    const products = favProducts.byList[listId] || {};
    return products;
  }
);

/**
 * Creates a selector that selects all products that belong
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavorites = (getListCode) => {
  const getFavoritesIdsByList = makeGetFavoritesIdsByList(getListCode);
  return createSelector(
    getFavoritesIdsByList,
    getProducts,
    (ids, products) => ids
      .filter(id => !!products[id] && products[id].productData)
      .map(id => products[id].productData)
  );
};

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

    return !Object.values(products.byList).every(l => l.ready);
  }
);

/**
 * @param {Object} state The global state.
 * @return {number}
 */
export const getFavoritesCount = createSelector(
  getFavoritesProducts,
  (products) => {
    if (!products?.byList) {
      return 0;
    }
    return Object
      .values(products.byList)
      .reduce((prev, list) => prev + list.ids.length, 0);
  }
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

    return Object.values(products.byList).every(l => l.isFetching);
  }
);

/**
 * @param {Function} getProductCode Reads the product id.
 * @param {Function} getListCode Reads the list id.
 * @return {boolean}
 */
export const makeIsProductOnSpecificFavoriteList = (getProductCode, getListCode) => createSelector(
  getProductCode,
  getListCode,
  getFavoritesProducts,
  (productId, listId, products) => !!products.byList[listId]?.ids.includes(productId)
);

/**
 * @param {Function} getProductCode Reads the product id.
 * @return {boolean}
 */
export const makeIsProductOnFavoriteList = getProductCode => createSelector(
  getProductCode,
  getFavoritesProducts,
  (productId, products) => !!Object
    .values(products.byList)
    .find(list => !!list.ids.find(p => p === productId))
);
/**
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isCurrentProductOnFavoriteList = makeIsProductOnFavoriteList(getProductId);

/**
 * Returns all relatives which are on favorites.
 * @param {Object} state Current state.
 * @param {string} productId
 * @returns {Array}
 */
export const getProductRelativesOnFavorites = createSelector(
  getKnownRelatives,
  getFavoritesProducts,
  (productRelativesIds, products) => productRelativesIds.filter(
    id => !!Object
      .values(products.byList)
      .find(list => !!list.ids.find(p => id === p))
  )
);

/**
 * Returns all relatives which are on a specific favorites list.
 * @param {Function} getListCode Gets the list code.
 * @returns {Function}
 */
export const makeGetProductRelativesOnFavorites = getListCode => createSelector(
  getListCode,
  getKnownRelatives,
  getFavoritesProducts,
  (listId, productRelativesIds, products) => productRelativesIds.filter(
    id => products.byList[listId]?.ids.find(p => id === p)
  )
);

/**
 * Checks if product or any relative is on favorites list.
 * @param {Object} state Current state.
 * @param {string} productId Product id.
 * @return {boolean}
 */
export const isRelativeProductOnList = createSelector(
  getProductRelativesOnFavorites,
  relativesOnFavorites => relativesOnFavorites.length > 0
);
