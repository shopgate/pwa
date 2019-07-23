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
} from '../constants';

/**
 * First action to add one product to favorites.
 * @param {number} productId Id of the product to add.
 * @returns {Object}
 */
export const addProductToFavorites = productId => ({
  type: ADD_PRODUCT_TO_FAVORITES,
  productId,
});

/**
 * First action to remove one product to favorites.
 * @param {number} productId Id of the product to remove.
 * @param {boolean} withRelatives States, whether to remove all relative products or not.
 * @returns {Object}
 */
export const removeProductFromFavorites = (productId, withRelatives) => ({
  type: REMOVE_PRODUCT_FROM_FAVORITES,
  productId,
  withRelatives,
});

/**
 * Error on fetch favorites action.
 * @param {Error} error Error.
 * @returns {Object}
 */
export const errorFetchFavorites = error => ({
  type: ERROR_FETCH_FAVORITES,
  error,
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
 * @returns {Object}
 */
export const requestAddFavorites = productId => ({
  type: REQUEST_ADD_FAVORITES,
  productId,
});

/**
 * Action to be triggered upon successful addFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @returns {Object}
 */
export const successAddFavorites = productId => ({
  type: SUCCESS_ADD_FAVORITES,
  productId,
});

/**
 * Action to be triggered upon a failed addFavorites pipeline call.
 * @param {string} productId Product identifier.
 * @param {Error} error The error that occurred.
 * @returns {Object}
 */
export const errorAddFavorites = (productId, error) => ({
  type: ERROR_ADD_FAVORITES,
  productId,
  error,
});

/**
 * Request remove favorites action. This action just updates the redux store.
 * @param {string} productId Product identifier.
 * @returns {Object}
 */
export const requestRemoveFavorites = productId => ({
  type: REQUEST_REMOVE_FAVORITES,
  productId,
});

/**
 * Action to be triggered upon successful removeFavorites (deleteFavorites)  pipeline call.
 * @param {string} productId Product identifier.
 * @returns {Object}
 */
export const successRemoveFavorites = productId => ({
  type: SUCCESS_REMOVE_FAVORITES,
  productId,
});

/**
 * Action to be triggered upon a failed removeFavorites (deleteFavorites) pipeline call.
 * @param {string} productId Product identifier.
 * @param {Error} error The error that occurred.
 * @returns {Object}
 */
export const errorRemoveFavorites = (productId, error) => ({
  type: ERROR_REMOVE_FAVORITES,
  productId,
  error,
});

/**
 * Return the flush favorites buffer Now action object
 * @return {Object}
 */
export const requestFlushFavoritesBuffer = () => ({
  type: REQUEST_FLUSH_FAVORITES_BUFFER,
});

/**
 * Idle sync action.
 * @returns {Object}
 */
export const idleSyncFavorites = () => ({
  type: IDLE_SYNC_FAVORITES,
});

/**
 * Action to cancel one or multiple request to add or to remove favorites.
 * @param {number} [count=1] Optional count of sync requests.
 * @returns {Object}
 */
export const cancelRequestSyncFavorites = (count = 1) => ({
  type: CANCEL_REQUEST_SYNC_FAVORITES,
  count,
});

/**
 * Receive favorites action.
 * @param {Array} products Products.
 * @param {number} requestTimestamp Time when request was inited (ms).
 * @returns {Object}
 */
export const receiveFavorites = (products, requestTimestamp) => ({
  type: RECEIVE_FAVORITES,
  products,
  requestTimestamp,
});

/**
 * Request favorites action.
 * @returns {Object}
 */
export const requestFavorites = () => ({
  type: REQUEST_FAVORITES,
});
