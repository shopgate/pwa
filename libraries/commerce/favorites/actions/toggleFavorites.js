import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { getWishlistItemQuantityEnabled } from '@shopgate/engage/core/selectors/merchantSettings';
import {
  getFavoritesDefaultList,
  getFavoritesLists,
  makeIsProductOnSpecificFavoriteList,
} from '../selectors';
import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestFlushFavoritesBuffer,
  openFavoritesListChooser,
  updateProductInFavorites,
} from '../action-creators';
import fetchFavoritesListsWithItems from './fetchFavoritesListsWithItems';

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @mixes {MutableFunction}
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes New favorites notes to set
 * @return {Function}
 */
export const addFavorite = mutable((productId, listId, quantity, notes) => (dispatch, getState) => {
  const defaultList = getFavoritesDefaultList(getState());
  dispatch(addProductToFavorites(productId, listId || defaultList.id, quantity, notes));
});

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @return {Function}
 * @deprecated Please use `addFavorite` instead.
 */
export const addFavorites = addFavorite;

/**
 * Removes a product and optionally its relatives from the favorite list (debounced and buffered).
 * @mixes {MutableFunction}
 * @param {string} productId Product identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @param {string} listId List identifier.
 * @returns {Function}
 */
export const removeFavorites = mutable(
  (productId, withRelatives = false, listId) => (dispatch, getState) => {
    const defaultList = getFavoritesDefaultList(getState());
    dispatch(removeProductFromFavorites(productId, withRelatives, listId || defaultList.id));
  }
);

/**
 * Triggers a sync of favorites by immediately flushing buffered favorite update actions.
 * @mixes {MutableFunction}
 * @return {Function}
 */
export const requestSync = mutable(listId => (dispatch) => {
  dispatch(requestFlushFavoritesBuffer(listId));
});

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @return {Function}
 */
export const toggleFavorite = (productId, listId, withRelatives = false) =>
  (dispatch, getState) => {
    // With quantity enabled the favorites button always adds (increases quantity)
    const wishlistItemQuantityEnabled = getWishlistItemQuantityEnabled(getState());
    if (wishlistItemQuantityEnabled) {
      dispatch(addFavorite(productId, listId));
    } else {
      const isOnList = makeIsProductOnSpecificFavoriteList(
        () => productId,
        () => listId
      )(getState());
      dispatch(!isOnList
        ? addFavorite(productId, listId)
        : removeFavorites(productId, withRelatives, listId));
    }
  };

/**
 * Updatest a product in the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {number} quantity
 * @param {string} notes
 * @return {Function}
 */
export const updateFavorite = mutable((productId, listId, quantity, notes) =>
  (dispatch, getState) => {
    const defaultList = getFavoritesDefaultList(getState());
    dispatch(updateProductInFavorites(productId, listId || defaultList.id, quantity, notes));
  });

/**
 * Adds a product to a wishlist by opening a chooser if user has multiple lists.
 * @mixes {MutableFunction}
 * @param {string} productId Product identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @return {Function}
 */
export const toggleFavoriteWithListChooser = mutable(
  (productId, withRelatives = false) =>
    async (dispatch, getState) => {
      // Ensure favorites lists are fetched before.
      // In some cases this fetch will NOT happen on app start
      await dispatch(fetchFavoritesListsWithItems());

      const state = getState();
      const lists = getFavoritesLists(state);

      // Only one list available therefore we just add/remove it the product there.
      if (lists.length <= 1) {
        dispatch(toggleFavorite(productId, lists[0].id, withRelatives));
        return;
      }

      dispatch(openFavoritesListChooser(productId, withRelatives));
    }
);
