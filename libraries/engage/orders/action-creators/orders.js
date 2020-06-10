import { CLEAR_ORDERS } from '../constants';

/**
 * Creates the dispatched CLEAR_ORDERS action object.
 * @returns {Object} The dispatched action object.
 */
export const clearOrders = () => ({
  type: CLEAR_ORDERS,
});
