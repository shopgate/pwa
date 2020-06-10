import { createSelector } from 'reselect';

/**
 * Retrieves the orders state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
const getOrdersState = state => state.orders || {};

/**
 * Retrieves the ordersByNumber state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
const getOrdersByIdState = state => getOrdersState(state).ordersById || {};

/**
 * Creates the selector that retrieves an order by its number.
 * @returns {Function}
 */
export const makeGetOrderById = () => createSelector(
  (state, props) => props.orderId,
  getOrdersByIdState,
  (orderId, orders) => orders?.[orderId]?.order || null
);
