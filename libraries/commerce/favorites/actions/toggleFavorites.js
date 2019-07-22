import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestFlushFavoritesBuffer,
} from '../action-creators';

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @return {Function}
 */
export const addFavorite = productId => (dispatch) => {
  dispatch(addProductToFavorites(productId));
};

/**
 * Adds a product to the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @return {Function}
 * @deprecated Please use `addFavorite` instead.
 */
export const addFavorites = addFavorite;

/**
 * Removes a product and optionally its relatives from the favorite list (debounced and buffered).
 * @param {string} productId Product identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @returns {Function}
 */
export const removeFavorites = (productId, withRelatives = false) => (dispatch) => {
  dispatch(removeProductFromFavorites(productId, withRelatives));
};

/**
 * Triggers a sync of favorites by immediately flushing buffered favorite update actions.
 * @return {Function}
 */
export const requestSync = () => (dispatch) => {
  dispatch(requestFlushFavoritesBuffer());
};
