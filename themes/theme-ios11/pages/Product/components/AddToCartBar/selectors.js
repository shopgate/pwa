import { createSelector } from 'reselect';

/**
 * Selects the addToCartBar state.
 * @param {Object} state The current application state.
 * @return {Object}
 */
const getAddToCartBarState = state => state.ui.addToCartBar;

/**
 * Selects the current added count from the addToCartBar state.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const selectActionCount = createSelector(
  getAddToCartBarState,
  state => state.added
);

/**
 * Returns whether the addToCartBar is visible or not.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isVisible = createSelector(
  getAddToCartBarState,
  state => state.visible
);
