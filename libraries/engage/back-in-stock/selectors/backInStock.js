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
 * Creates a selector that retrieves if a specific product is already on the Back in Stock list
 * @returns {Function}
 */
export const getIsProductOnBackInStockListByVariant = createSelector(
  (state, props = {}) => props.variantId,
  getBackInStockSubscriptions,
  (variantId, subscriptions) => {
    if (!variantId) {
      return false;
    }

    return subscriptions.some(({ productCode }) =>
      productCode === variantId);
  }
);

/**
 * Creates a selector that retrieves if a specific product is already on the Back in Stock list
 * @returns {Function}
 */
export const getIsProductOnBackInStockListByCharacteristics = createSelector(
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
      return false;
    }

    return subscriptions.some(({ productCode }) =>
      productCode === found.id);
  }
);

