import {
  ADD_PRODUCT_TO_FAVORITES,
  REMOVE_PRODUCT_FROM_FAVORITES,
  CANCEL_REQUEST_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  REQUEST_ADD_FAVORITES,
  SUCCESS_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  ERROR_FAVORITES,
  IDLE_SYNC_FAVORITES,
  REQUEST_FLUSH_FAVORITES_BUFFER,
  OPEN_FAVORITE_LIST_CHOOSER,
  CLOSE_FAVORITE_LIST_CHOOSER,
  REQUEST_UPDATE_FAVORITES,
  SUCCESS_UPDATE_FAVORITES,
  ERROR_UPDATE_FAVORITES,
  UPDATE_PRODUCT_IN_FAVORITES,
  OPEN_FAVORITE_COMMENT_DIALOG,
  CLOSE_FAVORITE_COMMENT_DIALOG,
} from '../constants';
import { makeGetFavorites } from '../selectors';

/**
 * First action to add one product to favorites.
 * @param {number} productId Id of the product to add.
 * @param {string} listId List identifier.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes New favorites notes to set
 * @param {boolean} showToast Whether to show a confirmation toast after product was added
 * @returns {Object}
 */
export const addProductToFavorites = (productId, listId, quantity, notes, showToast = true) => ({
  type: ADD_PRODUCT_TO_FAVORITES,
  productId,
  listId,
  quantity,
  notes,
  showToast,
});

/**
 * First action to update a product in favorites.
 * @param {number} productId Id of the product to add.
 * @param {string} listId List identifier.
 * @param {number} quantity The quantity of the product.
 * @param {string} notes Notes about the product.
 * @returns {Object}
 */
export const updateProductInFavorites = (productId, listId, quantity, notes) => ({
  type: UPDATE_PRODUCT_IN_FAVORITES,
  productId,
  listId,
  notes,
  quantity,
});

/**
 * First action to remove one product to favorites.
 * @param {number} productId Id of the product to remove.
 * @param {boolean} withRelatives States, whether to remove all relative products or not.
 * @param {string} listId List identifier.
 * @returns {Object}
 */
export const removeProductFromFavorites = (productId, withRelatives, listId) => ({
  type: REMOVE_PRODUCT_FROM_FAVORITES,
  productId,
  withRelatives,
  listId,
});

/**
 * Error on fetch favorites action.
 * @param {Error} error Error.
 * @param {string} listId List identifier.
 * @returns {Object}
 */
export const errorFetchFavorites = (error, listId) => ({
  type: ERROR_FETCH_FAVORITES,
  error,
  listId,
});

/**
 * Error on favorites action.
 * @param {string} productId Product identifier.
 * @param {Error} error Error.
 * @returns {Object}
 */
export const errorFavorites = (productId, error) => ({
  type: ERROR_FAVORITES,
  productId,
  error,
});

/**
 * Request add favorites action. This action just updates the redux store.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes New favorites notes to set
 * @param {boolean} showToast Whether to show a confirmation toast after product was added
 * @returns {Object}
 */
export const requestAddFavorites = (productId, listId, quantity, notes, showToast = true) => ({
  type: REQUEST_ADD_FAVORITES,
  productId,
  listId,
  quantity,
  notes,
  showToast,
});

/**
 * Action to be triggered upon successful addFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {boolean} showToast Whether to show a confirmation toast after product was added
 * @returns {Object}
 */
export const successAddFavorites = (productId, listId, showToast = true) => ({
  type: SUCCESS_ADD_FAVORITES,
  productId,
  listId,
  showToast,
});

/**
 * Action to be triggered upon a failed addFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @param {Error} error The error that occurred.
 * @param {string} listId List identifier.
 * @returns {Object}
 */
export const errorAddFavorites = (productId, error, listId) => ({
  type: ERROR_ADD_FAVORITES,
  productId,
  listId,
  error,
});

/**
 * Request update favorites action. This action just updates the redux store.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {number} quantity The quantity of the product
 * @param {string} notes Notes about the product
 * @returns {Object}
 */
export const requestUpdateFavorites = (productId, listId, quantity, notes) => ({
  type: REQUEST_UPDATE_FAVORITES,
  productId,
  listId,
  notes,
  quantity,
});

/**
 * Action to be triggered upon successful updateFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @returns {Object}
 */
export const successUpdateFavorites = (productId, listId) => ({
  type: SUCCESS_UPDATE_FAVORITES,
  productId,
  listId,
});

/**
 * Action to be triggered upon failed updateFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @param {Error} error The error that occurred.
 * @returns {Object}
 */
export const errorUpdateFavorites = (productId, listId, error) => ({
  type: ERROR_UPDATE_FAVORITES,
  productId,
  listId,
  error,
});

/**
 * Request remove favorites action. This action just updates the redux store.
 * @param {string} productId Product identifier.
 * @param {string} listId List identifier.
 * @returns {Object}
 */
export const requestRemoveFavorites =
  (productId, listId) => (dispatch, getState) => {
    const getFavorites = makeGetFavorites(() => listId);
    const favorites = getFavorites(getState());
    const matchingFavorite = favorites.find(({ productId: itemProductId }) =>
      itemProductId === productId) || {};

    return dispatch({
      type: REQUEST_REMOVE_FAVORITES,
      productId,
      listId,
      quantity: matchingFavorite.quantity || 1,
      notes: matchingFavorite.notes || '',
    });
  };

/**
 * Action to be triggered upon successful removeFavorites (deleteFavorites)  pipeline call.
 * @param {string} productId Product identifier.
 * @param {number} takenListId List id
 * @returns {Object}
 */
export const successRemoveFavorites = (productId, takenListId) => ({
  type: SUCCESS_REMOVE_FAVORITES,
  productId,
  listId: takenListId,
});

/**
 * Action to be triggered upon a failed removeFavorites (deleteFavorites) pipeline call.
 * @param {string} productId Product identifier.
 * @param {string} takenListId List id
 * @param {Error} error The error that occurred.
 * @param {number} quantity Quantity of the favorite
 * @param {string} notes Notes of the favorite
 * @returns {Object}
 */
export const errorRemoveFavorites = (productId, takenListId, error, quantity, notes) => ({
  type: ERROR_REMOVE_FAVORITES,
  productId,
  listId: takenListId,
  error,
  quantity,
  notes,
});

/**
 * Return the flush favorites buffer Now action object
 * @param {string} listId The Id of the wishlist.
 * @return {Object}
 */
export const requestFlushFavoritesBuffer = listId => ({
  type: REQUEST_FLUSH_FAVORITES_BUFFER,
  listId,
});

/**
 * Idle sync action.
 * @param {string} listId The Id of the wishlist.
 * @returns {Object}
 */
export const idleSyncFavorites = listId => ({
  type: IDLE_SYNC_FAVORITES,
  listId,
});

/**
 * Action to cancel one or multiple request to add or to remove favorites.
 * @param {number} [count=1] Optional count of sync requests.
 * @param {string} listId The Id of the wishlist.
 * @returns {Object}
 */
export const cancelRequestSyncFavorites = (count = 1, listId) => ({
  type: CANCEL_REQUEST_SYNC_FAVORITES,
  count,
  listId,
});

/**
 * Receive favorites action.
 * @param {Array} items Wishlist items.
 * @param {number} requestTimestamp Time when request was initiated (ms).
 * @param {string} listId The Id of the wishlist.
 * @returns {Object}
 */
export const receiveFavorites = (items, requestTimestamp, listId = null) => ({
  type: RECEIVE_FAVORITES,
  items,
  requestTimestamp,
  listId,
});

/**
 * Request favorites action.
 * @param {string} listId The Id of the wishlist.
 * @returns {Object}
 */
export const requestFavorites = (listId = null) => ({
  type: REQUEST_FAVORITES,
  listId,
});

/**
 * Opens the favorite list chooser.
 * @param {string} productId The Id of the product.
 * @param {boolean} withRelatives States, whether to remove all relative products or not.
 * @returns {Object}
 */
export const openFavoritesListChooser = (productId, withRelatives = false) => ({
  type: OPEN_FAVORITE_LIST_CHOOSER,
  productId,
  withRelatives,
});

/**
 * Opens the favorite list chooser.
 * @returns {Object}
 */
export const closeFavoritesListChooser = () => ({
  type: CLOSE_FAVORITE_LIST_CHOOSER,
});

/**
 * Opens the favorite comment sheet
 * @param {string} productId The id of the product.
 * @param {string} listId The id of the list.
 * @returns {Object}
 */
export const openFavoritesCommentDialog = (productId, listId) => ({
  type: OPEN_FAVORITE_COMMENT_DIALOG,
  productId,
  listId,
});

/**
 * Closes the favorite comment sheet
 * @returns {Object}
 */
export const closeFavoritesCommentDialog = () => ({
  type: CLOSE_FAVORITE_COMMENT_DIALOG,
});
