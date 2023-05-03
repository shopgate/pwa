import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';
import {
  getProductId, getProducts,
} from '../../product/selectors/product';
import { getKnownRelatives } from '../../product/selectors/variants';

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
export const getFavoritesItemsByList = createSelector(
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
  lists => lists[0]
);

export const hasMultipleFavoritesList = createSelector(
  getFavoritesLists,
  lists => lists.length > 1
);

/**
 * @param {Object} state The global state.
 * @returns {Array}
 * @deprecated
 */
export const getFavoritesItems = createSelector(
  getFavoritesItemsByList,
  (favorites) => {
    if (!favorites || !favorites.byList) {
      return [];
    }

    return uniq(Object
      .values(favorites.byList)
      .map(l => l.items)
      .flat());
  }
);

/**
 * @param {Object} state The global state.
 * @deprecated
 */
export const getFavoritesProducts = createSelector(
  getFavoritesItems,
  items => items
    .map(({ product }) => product)
);

/**
 * Creates a selector that selects all items that belong
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavoritesItemsByList = getListCode => createSelector(
  getFavoritesItemsByList,
  getListCode,
  (favItems, listId) => favItems.byList[listId]?.items || []
);

export const getCommentSheetSettings = createSelector(
  getFavoritesListState,
  getFavoritesItemsByList,
  ({ commentSheet }, favItems) => {
    const { listId, productId } = commentSheet || {};
    if (!listId || !productId) {
      return undefined;
    }

    const items = favItems.byList[listId]?.items || [];
    const item = items.find(({ product }) => productId === product.id);

    if (!item) {
      return undefined;
    }

    return { listId, productId, item };
  }
);

/**
 * Creates a selector that selects all protects that belong
 * to the given favorite list.
 * @param {string} listId The list code.
 * @param {string} productId The product code.
 * @returns {Function}
 */
export const makeGetProductFromFavorites = (listId, productId) => {
  const getFavoritesItemsByListId = makeGetFavoritesItemsByList(() => listId);

  return createSelector(
    getFavoritesItemsByListId,
    getProducts,
    (items, products) => {
      const matchingProduct =
        items.find(({ product }) => product.id === productId)?.product ||
        products[productId]?.productData;
      return matchingProduct || {};
    }
  );
};

/**
 * True when favorites where not yet fetched for the first time.
 * @param {Object} state The global state.
 * @returns {boolean}
 */
export const isInitialLoading = createSelector(
  getFavoritesItemsByList,
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
  getFavoritesItemsByList,
  (products) => {
    if (!products?.byList) {
      return 0;
    }

    return Object
      .values(products.byList)
      .reduce((prev, list) => prev + list.items.length, 0);
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
  getFavoritesItemsByList,
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
  getFavoritesItemsByList,
  (productId, listId, products) =>
    !!products.byList[listId]?.items.some(({ product }) => product.id === productId)
);

/**
 * @param {Function} getProductCode Reads the product id.
 * @return {boolean}
 */
export const makeIsProductOnFavoriteList = getProductCode => createSelector(
  getProductCode,
  getFavoritesItemsByList,
  (productId, products) => !!Object
    .values(products.byList)
    .find(list => !!list?.items?.find(({ product }) => product.id === productId))
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
  getFavoritesItemsByList,
  (productRelativesIds, items) => productRelativesIds.filter(
    id => !!Object
      .values(items.byList)
      .find(list => !!list.items.find(({ product }) => id === product.id))
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
  getFavoritesItemsByList,
  (listId, productRelativesIds, products) =>
     products.byList[listId]?.items
      .filter(({ product }) => productRelativesIds.includes(product.id))
      .map(({ product }) => product)
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
