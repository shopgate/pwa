import { createSelector } from 'reselect';
import { makeGetProductByCharacteristics } from '@shopgate/engage/product';
import { appConfig } from '@shopgate/engage';
import { getClientInformation, isIos as getIsIos } from '@shopgate/engage/core';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_SUPPORTED,
} from '@shopgate/engage/core/constants';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockState = state => state.backInStock;

/**
 * Selector to retrieve the back-in-stock subscriptions list
 * @returns {Array}
 */
export const getBackInStockSubscriptions = createSelector(
  getBackInStockState,
  state => state.subscriptions
);

/**
 * Selector to retrieve the current fetching state of back-in-stock subscriptions
 * @returns {boolean}
 */
export const getBackInStockSubscriptionsFetching = createSelector(
  getBackInStockState,
  state => state.isFetching
);

/**
 * Selector to determine if back-in-stock subscriptions have been fetched before
 * @returns {boolean}
 */
export const getBackInStockSubscriptionsInitial = createSelector(
  getBackInStockState,
  state => state.isInitial
);

/**
 * Selector to retrieve the current status of the push app permission
 * @returns {string}
 */
export const getBackInStockPushPermissionStatus = createSelector(
  getBackInStockState,
  state => state.pushPermissionStatus
);

/**
 * Creates a selector that retrieves the subscription of
 * a product / variant or null by its variantId / productId
 * @param {Object} params Params
 * @param {string} params.status Get subscription for a specific status
 * @returns {Function}
 */
export const makeGetSubscriptionByProduct = ({ status } = {}) => createSelector(
  (state, props = {}) => (props.variantId ? props.variantId : props.productId),
  getBackInStockSubscriptions,
  (requestedProductCode, subscriptions) => {
    if (!requestedProductCode) {
      return false;
    }

    return subscriptions.find(({ productCode, status: subscriptionStatus }) => {
      let match = productCode === requestedProductCode;

      if (match && status) {
        // When the selector factory is created for a specific status, the subscription also
        // needs to fulfill this condition
        match = subscriptionStatus === status;
      }

      return match;
    }) || null;
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
 * Selector to determine if the back-in-stock feature is enabled
 * @returns {boolean}
 */
export const getIsBackInStockEnabled = createSelector(
  getClientInformation,
  getIsIos,
  getBackInStockPushPermissionStatus,
  (clientInformation, isIos, pushPermissionStatus) => {
    const isRNEngage = navigator.userAgent.includes('RN Engage');

    /**
     * No support for the react-native-engage dev app on iOS since push token handling will not
     * work as expected, and back-in-stock related requests will fail.
     */
    if (isIos && isRNEngage) {
      return false;
    }

    const { codebaseVersion = '0.0.0' } = clientInformation;
    const [major] = codebaseVersion.split('.');

    /**
     * The feature can be enabled on react-native-engage based apps (>= 11.0.0) with proper
     * support for push permissions checks
     */
    if (parseInt(major, 10) < 11 || pushPermissionStatus === PERMISSION_STATUS_NOT_SUPPORTED) {
      return false;
    }

    return appConfig?.showBackInStock || false;
  }
);

/**
 * Selector to determine if back-in-stock related requests are currently possible.
 * @returns {boolean}
 */
export const getAreBackInStockRequestsPossible = createSelector(
  getIsBackInStockEnabled,
  getBackInStockPushPermissionStatus,
  (featureEnabled, pushPermissionStatus) =>
    featureEnabled && pushPermissionStatus === PERMISSION_STATUS_GRANTED
);

/**
 * Returns if subscription list is in use
 * @returns {boolean}
 */
export const getHasBackInStockSubscriptions = createSelector(
  getBackInStockSubscriptions,
  subscriptions => !!subscriptions.length
);
