import { createSelector } from 'reselect';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getCart } from '@shopgate/pwa-common-commerce/cart/selectors';
import { makeIsProductActive, makeIsBaseProductActive } from '@shopgate/engage/product/selectors/product';
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

export const getCoupons = createSelector(
  getCart,
  cart => cart?.coupons || []
);

export const getAppliedPromotions = createSelector(
  getCart,
  cart => cart?.appliedPromotions || []
);

export const getAppliedPromotionsWithoutCoupons = createSelector(
  getAppliedPromotions,
  promotions => promotions.filter(({ coupon }) => coupon === null)
);

export const getPromotionCoupons = createSelector(
  getCoupons,
  getAppliedPromotions,
  (coupons, promotions) => coupons.map((coupon) => {
    const code = coupon?.promotion?.code;
    const promotion = promotions.find(promotionEntry => promotionEntry.code === code);

    return {
      ...coupon,
      promotion: {
        ...coupon?.promotion || {},
        ...promotion,
      },
    };
  })
);
