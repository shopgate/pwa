import { createSelector } from 'reselect';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptions = state => state.backInStock.subscriptions;

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptionsFetching = state => state.backInStock.isFetching;

/**
 * @param {Function} getListCode Selects the list code.
 * @returns {Function}
 */
export const makeGetIsProductOnBackInStockList = ({ productCode }) => createSelector(
  getBackInStockSubscriptions,
  subscriptions => subscriptions.some(({ productCode: subscriptionProductCode }) =>
    subscriptionProductCode === productCode)
);

