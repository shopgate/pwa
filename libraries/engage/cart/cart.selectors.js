import { createSelector } from 'reselect';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeIsProductActive, makeIsBaseProductActive } from '@shopgate/engage/product';
import {
  makeIsRopeProductOrderable,
  getPreferredLocation,
  getPreferredFulfillmentMethod,
  DIRECT_SHIP,
} from '../locations';
import { makeGetEnabledFulfillmentMethods } from '../core';

/**
 * Creates a selector that determines if a cart button is supposed to be disabled.
 * @returns {Function}
 */
export function makeIsAddToCartButtonDisabled() {
  const isProductActive = makeIsProductActive();
  const isBaseProductActive = makeIsBaseProductActive();
  const isRopeProductOrderable = makeIsRopeProductOrderable(
    (state, props) => getPreferredLocation(state, props)?.code,
    (state, props) => props.variantId || props.productId || null
  );
  const getEnabledMerchantFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  return createSelector(
    getEnabledMerchantFulfillmentMethods,
    getPreferredFulfillmentMethod,
    hasProductVariants,
    isProductActive,
    isBaseProductActive,
    isProductOrderable,
    isRopeProductOrderable,
    (
      merchantFulfillmentMethods,
      userLocationFulfillmentMethod,
      productHasVariants,
      productActive,
      baseProductActive,
      productOrderable,
      ropeProductOrderable
    ) => {
      if (!productActive || !baseProductActive) {
        return true;
      }

      const isDirectShipSelected =
        !merchantFulfillmentMethods ||
        !userLocationFulfillmentMethod ||
        userLocationFulfillmentMethod === DIRECT_SHIP;

      if (isDirectShipSelected) {
        return !productOrderable && !productHasVariants;
      }

      return ropeProductOrderable === false && !productHasVariants;
    }
  );
}
