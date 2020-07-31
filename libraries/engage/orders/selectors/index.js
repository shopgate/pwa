import { createSelector } from 'reselect';

/**
 * Retrieves the orders state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
const getOrdersState = state => state.orders || {};

/**
 * Retrieves the ordersById state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
const getOrdersByIdState = state => getOrdersState(state).ordersById || {};

/**
 * Retrieves the ordersByNumber state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
const getOrdersByNumberState = state => getOrdersState(state).ordersByNumber || {};

/**
 * Retrieves the orders from the store.
 * @param {Object} state The current application state.
 * @return {Object} The orders state.
 */
export const getOrders = state => getOrdersState(state).orders.orders;

/**
 * Creates the selector that retrieves an order by its number.
 * @returns {Function}
 */
export const makeGetOrderById = () => createSelector(
  (state, props) => props.orderId,
  getOrdersByIdState,
  (orderId, orders) => orders?.[orderId]?.order || null
);

/**
 * Creates the selector that retrieves an order by its number.
 * @returns {Function}
 */
export const makeGetOrderByNumber = () => createSelector(
  (state, props) => props.orderNumber,
  getOrdersByNumberState,
  (orderNumber, orders) => orders?.[orderNumber]?.order || null
);
