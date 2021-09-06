import {
  RESET_ORDERS_PLACED_COUNT,
  INCREASE_ORDERS_PLACED_COUNT,
  RESET_ORDERS_PLACED_STATE,
} from '../constants';

/**
 * Increment the orders placed count
 * @return {Object} The dispatched action object.
 */
export const increaseOrdersPlacedCount = () => ({
  type: INCREASE_ORDERS_PLACED_COUNT,
});

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetOrdersPlacedCount = () => ({
  type: RESET_ORDERS_PLACED_COUNT,
});

/**
 * Reset orders placed state
 * @return {Object} The dispatched action object.
 */
export const resetOrdersPlacedState = () => ({
  type: RESET_ORDERS_PLACED_STATE,
});
