import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestFlushFavoritesBuffer,
} from '../action-creators';

/**
 * UI Entry point to add a favorite (plural name for compatibility reasons).
 * @param {string} productId Product identifier.
 * @return {Function}
 * @deprecated Please use `addFavorite` instead.
 */
export const addFavorites = productId => (dispatch) => {
  dispatch(addProductToFavorites(productId));
};
export const addFavorite = addFavorites;

/**
 * UI Entry point to remove favorites.
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
