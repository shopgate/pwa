import * as actionTypes from './constants';

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const incrementActionCount = () => ({
  type: actionTypes.INCREMENT_ACTION_COUNT,
});

/**
 * Dispatches the DECREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const decrementActionCount = () => ({
  type: actionTypes.DECREMENT_ACTION_COUNT,
});

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const resetActionCount = () => ({
  type: actionTypes.RESET_ACTION_COUNT,
});

/**
 * Dispatches the SHOW_ADD_TO_CART_BAR action.
 * @return {Object}
 */
export const showAddToCartBar = () => ({
  type: actionTypes.SHOW_ADD_TO_CART_BAR,
});

/**
 * Dispatches the HIDE_ADD_TO_CART_BUTTON action.
 * @return {Object}
 */
export const hideAddToCartBar = () => ({
  type: actionTypes.HIDE_ADD_TO_CART_BAR,
});
