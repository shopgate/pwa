import {
  APP_RATING_RESET_ORDERS_PLACED_COUNT,
  APP_RATING_INCREASE_ORDERS_PLACED_COUNT,
} from '../constants';

/**
 * Increment the orders placed count
 * @return {Object} The dispatched action object.
 */
export const increaseOrdersPlacedCount = () => ({
  type: APP_RATING_INCREASE_ORDERS_PLACED_COUNT,
});

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetOrdersPlacedCount = () => ({
  type: APP_RATING_RESET_ORDERS_PLACED_COUNT,
});
