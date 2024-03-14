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
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptions = createSelector(
  getBackInStockState,
  state => state.subscriptions
);

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptionsFetching = createSelector(
  getBackInStockState,
  state => state.isFetching
);

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockSubscriptionsInitial = createSelector(
  getBackInStockState,
  state => state.isInitial
);

/**
 * Creates a selector to retrieve the current status of the push app permission
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getBackInStockPushPermissionStatus = createSelector(
  getBackInStockState,
  state => state.pushPermissionStatus
);

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
 * Creates a selector to determine if the back-in-stock feature is enabled
 * @returns {Function}
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
 * Creates a selector to determine if back-in-stock related requests are currently possible.
 * @returns {Function}
 */
export const getAreBackInStockRequestsPossible = createSelector(
  getIsBackInStockEnabled,
  getBackInStockPushPermissionStatus,
  (featureEnabled, pushPermissionStatus) =>
    featureEnabled && pushPermissionStatus === PERMISSION_STATUS_GRANTED
);

/**
 * Returns if subscription list is in use
 * @returns {Function}
 */
export const getHasBackInStockSubscriptions = createSelector(
  getBackInStockSubscriptions,
  subscriptions => !!subscriptions.length
);
