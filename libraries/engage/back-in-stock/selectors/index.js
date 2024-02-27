import { createSelector } from 'reselect';
import { makeGetProductByCharacteristics } from '@shopgate/engage/product';
import { appConfig } from '@shopgate/engage';

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
 * Creates a selector that retrieves the subscription of
 * a product / variant or null by its variantId / productId
 * @returns {Function}
 */
export const makeGetSubscriptionByProduct = () => createSelector(
  (state, props = {}) => (props.variantId ? props.variantId : props.productId),
  getBackInStockSubscriptions,
  (requestedProductCode, subscriptions) => {
    if (!requestedProductCode) {
      return false;
    }

    return subscriptions.find(({ productCode }) =>
      productCode === requestedProductCode) || null;
  }
);

/**
 * Creates a selector that retrieves the subscription of
 * a product / variant by its characteristics
 * @returns {Function}
 */
export const makeGetSubscriptionByCharacteristics = () => {
  const getProductByCharacteristics = makeGetProductByCharacteristics();

  return createSelector(
    getProductByCharacteristics,
    getBackInStockSubscriptions,
    (product, subscriptions) => {
      if (!product) {
        return null;
      }

      return subscriptions.find(({ productCode }) =>
        productCode === product.id) || null;
    }
  );
};

/**
 * Returns if the back in stock feature is enabled
 * @returns {Function}
 */
export const getIsBackInStockEnabled = () => appConfig?.showBackInStock;

/**
 * Returns if subscription list is in use
 * @returns {Function}
 */
export const getHasBackInStockSubscriptions = createSelector(
  getBackInStockSubscriptions,
  subscriptions => !!subscriptions.length
);
