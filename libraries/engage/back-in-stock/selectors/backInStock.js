import { createSelector } from 'reselect';
import { getProductVariants } from '@shopgate/pwa-common-commerce/product';
import isEqual from 'lodash/isEqual';

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
export const getSubscriptionByVariant = createSelector(
  (state, props = {}) => (props.variantId ? props.variantId : props.productId),
  getBackInStockSubscriptions,
  (variantId, subscriptions) => {
    if (!variantId) {
      return false;
    }

    return subscriptions.find(({ productCode }) =>
      productCode === variantId) || null;
  }
);

/**
 * Creates a selector that retrieves the subscription of
 * a product / variant by its characteristics
 * @returns {Function}
 */
export const getSubscriptionByCharacteristics = createSelector(
  getProductVariants,
  (state, props = {}) => props.characteristics,
  getBackInStockSubscriptions,
  (variants, characteristics, subscriptions) => {
    if (!variants) {
      return false;
    }

    const found = variants.products.find(product =>
      isEqual(product.characteristics, characteristics));

    if (!found) {
      return null;
    }

    return subscriptions.find(({ productCode }) =>
      productCode === found.id) || null;
  }
);

/**
 * Returns if the back in stock feature is enabled
 * @returns {Function}
 */
export const getIsBackInStockEnabled = () => true;

/**
 * Returns if subscription list is in use
 * @returns {Function}
 */
export const getHasBackInStockSubscriptions = createSelector(
  getBackInStockSubscriptions,
  subscriptions => !!subscriptions.length
);