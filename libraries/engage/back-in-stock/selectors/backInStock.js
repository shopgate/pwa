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
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptionsInitial = state => state.backInStock.isInitial;
/**
 * Creates a selector that retrieves if a specific product is already on the Back in Stock list
 * @param {Object} props Props.
 * @param {string} props.productCode The product which should be checked
 * @returns {Function}
 */
export const makeGetIsProductOnBackInStockList = ({ productCode }) => createSelector(
  getBackInStockSubscriptions,
  subscriptions => subscriptions.some(({ productCode: subscriptionProductCode }) =>
    subscriptionProductCode === productCode)
);

