import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { hasNewServices } from '@shopgate/engage/core/helpers';
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
  lists => lists.find(list => list.id === 'DEFAULT') ?? {
    id: 'DEFAULT',
  }
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
      .map(l => l.items.map(({ productId }) => productId))
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
  (favProducts, listId) =>
    favProducts?.byList[listId]?.items.map(({ productId }) => productId) || []
);

/**
 * Creates a selector that selects all products that belong
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavorites = getListCode => createSelector(
  getFavoritesProducts,
  getListCode,
  getProducts,
  (favItems, listId, products) => {
    const items = favItems?.byList[listId]?.items || [];
    return items.map(item => ({ ...item, product: products[item.productId]?.productData }));
  }
);

/**
 * Creates a selector that retrieves the amount of items on a specific favorites list
 * to the given favorite list.
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetFavoritesCountByList = (getListCode) => {
  const getFavoritesIdsByList = makeGetFavoritesIdsByList(getListCode);

  return createSelector(
    getFavoritesIdsByList,
    favorites => favorites.length
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

    return !Object.values(products?.byList).every(l => l.ready);
  }
);

/**
 * @param {Object} state The global state.
 * @param {Object} props The selector props
 * @param {boolean} [props.useItemQuantity=false] Whether to consider item quantity at calculation
 * @return {Function}
 */
export const getFavoritesCount = createSelector(
  getFavoritesProducts,
  (_, props) => props?.useItemQuantity || false,
  (products, useItemQuantity) => {
    if (!products?.byList) {
      return 0;
    }

    return Object
      .values(products.byList)
      .reduce((prev, list) =>
        prev + list.items.reduce((acc, { quantity = 1 }) => {
          if (useItemQuantity) {
            return acc + quantity;
          }

          return acc + 1;
        }, 0),
      0);
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

    return Object.values(products.byList).some(l => l.isFetching);
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
  (productId, listId, products) =>
    !!products.byList[listId]?.items.some(({ productId: itemProductId }) =>
      itemProductId === productId)
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
    .find(list => !!list?.items?.find(({ productId: itemProductId }) =>
      itemProductId === productId))

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
      .find(list => !!list.items.find(({ productId }) => id === productId))
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
    id => products.byList[listId]?.items.map(({ productId }) => productId).find(p => id === p)
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

export const getCommentDialogSettings = createSelector(
  getFavoritesListState,
  getFavoritesProducts,
  getProducts,
  ({ commentDialog }, favItems, products) => {
    const { listId, productId } = commentDialog || {};
    if (!listId || !productId) {
      return undefined;
    }

    const items = favItems.byList[listId]?.items || [];
    const item = items.find(({ productId: itemProductId }) => productId === itemProductId);

    if (!item) {
      return undefined;
    }

    return {
      listId,
      productId,
      item,
      product: products[item.productId]?.productData,
    };
  }
);

/**
 * Creates a selector that selects all products that belong
 * to the given favorite list.
 * @param {Function} getListCode Callback that's supposed to return a favorites list code
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
 * Creates a selector to check if the app has support for multiple favorites list.
 * @returns {Function}
 */
export const getHasMultipleFavoritesListsSupport = () =>
  hasNewServices() || appConfig?.favoritesMode?.hasMultipleFavoritesLists;

/**
 * Creates a selector the determine if the PWA is supposed to fetch favorite list entries via the
 * "getFavoriteIds" pipeline instead of "getFavorites".
 *
 * This pipeline was introduced in PWA6 when support for more than 100 items per favorite list was
 * requested. PWA-1877
 * @returns {Function}
 */
export const getUseGetFavoriteIdsPipeline = () => !hasNewServices();
