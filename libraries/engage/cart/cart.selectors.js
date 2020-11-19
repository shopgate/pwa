import { createSelector } from 'reselect';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getCart, getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';
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

export const hasLineItemPromotions = createSelector(
  getCartItems,
  cartItems => cartItems.some(({ appliedPromotions = [] }) => appliedPromotions.length > 0)
);

export const getCoupons = createSelector(
  getCart,
  getCartItems,
  (cart, cartItems) => (cart?.coupons || []).filter((coupon) => {
    // Filter coupons which are assigned to line items
    const code = coupon?.code;
    const lineItemCoupon = cartItems.find((cartItem) => {
      const lineItemPromotions = cartItem?.appliedPromotions || [];
      const match = lineItemPromotions.find((promotion) => {
        const lineItemCouponCode = promotion?.coupon?.code;
        return lineItemCouponCode === code;
      });

      return !!match;
    });

    return !lineItemCoupon;
  })
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
