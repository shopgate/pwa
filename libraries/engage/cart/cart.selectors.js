import { createSelector } from 'reselect';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  makeIsRopeProductOrderable,
  makeGetUserLocationFulfillmentMethod,
  DIRECT_SHIP,
} from '../locations';
import { makeGetEnabledFulfillmentMethods } from '../core';

/**
 * Creates a selector that determines if a cart button is supposed to be disabled.
 * @returns {Function}
 */
export function makeIsAddToCartButtonDisabled() {
  const isRopeProductOrderable = makeIsRopeProductOrderable(true);
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
  const getEnabledMerchantFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  return createSelector(
    getEnabledMerchantFulfillmentMethods,
    getUserLocationFulfillmentMethod,
    hasProductVariants,
    isProductOrderable,
    isRopeProductOrderable,
    (
      merchantFulfillmentMethods,
      userLocationFulfillmentMethod,
      productHasVariants,
      regularProductOrderable,
      ropeProductOrderable
    ) => {
      const isDirectShipSelected =
        !merchantFulfillmentMethods ||
        !userLocationFulfillmentMethod ||
        userLocationFulfillmentMethod === DIRECT_SHIP;

      if (isDirectShipSelected) {
        return !regularProductOrderable && !productHasVariants;
      }

      return ropeProductOrderable === false && !productHasVariants;
    }
  );
}
