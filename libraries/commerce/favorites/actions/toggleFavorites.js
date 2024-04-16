import { mutable } from '@shopgate/pwa-common/helpers/redux';
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
} from '../action-creators';
import { DEFAULT_FAVORITES_LIST_ID } from '../constants';

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @mixes {MutableFunction}
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @return {Function}
 */
export const addFavorite = mutable((productId, listId) => (dispatch, getState) => {
  const defaultList = getFavoritesDefaultList(getState());
  dispatch(addProductToFavorites(productId, listId || defaultList.id));
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
    const isOnList = makeIsProductOnSpecificFavoriteList(
      () => productId,
      () => listId
    )(getState());

    dispatch(!isOnList
      ? addFavorite(productId, listId)
      : removeFavorites(productId, withRelatives, listId));
  };

/**
 * Adds a product to a wishlist by opening a chooser if user has multiple lists.
 * @mixes {MutableFunction}
 * @param {string} productId Product identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @return {Function}
 */
export const toggleFavoriteWithListChooser = mutable(
  (productId, withRelatives = false) =>
    (dispatch, getState) => {
      const state = getState();
      const lists = getFavoritesLists(state);
      const listId = lists[0]?.id ?? DEFAULT_FAVORITES_LIST_ID;

      // Only one list available therefore we just add/remove it the product there.
      if (lists.length <= 1) {
        dispatch(toggleFavorite(productId, listId, withRelatives));
        return;
      }

      dispatch(openFavoritesListChooser(productId, withRelatives));
    }
);
