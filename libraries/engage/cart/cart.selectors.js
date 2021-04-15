import { createSelector } from 'reselect';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeIsProductActive, makeIsBaseProductActive } from '@shopgate/engage/product/selectors/product';
import { CART_ITEM_TYPE_PRODUCT } from '@shopgate/pwa-common-commerce/cart/constants';
import {
  DIRECT_SHIP,
} from '../locations';
import {
  getLocationsStorage,
  makeIsRopeProductOrderable,
  getPreferredLocation,
  getPreferredFulfillmentMethod,
} from '../locations/selectors';

import { makeGetEnabledFulfillmentMethods } from '../core';

/**
 * ########
 * The following block of selectors was copied over from @shopgate/pwa-common-commerce/cart
 * to prevent circular dependencies.
 * ########
 */

/**
 * Selects the cart data from the store.
 * @param {Object} state The current state.
 * @return {Object}
 */
const getCart = state => state.cart.data;

/**
  * Selects the cartItems from the current cart in the state.
  * @param {Object} state The current state.
  * @return {Array} The cartItems.
  */
const cartItemsSelector = state => state.cart.data.items;

/**
 * Selects all items from the cart.
 * @param {Object} state The current state.
 * @return {Array} The cart items.
 */
const getCartItems = createSelector(
  cartItemsSelector,
  cartItems => cartItems
);

/**
 * Selects the products from the cart.
 * @param {Object} state The current state.
 * @return {Object[]} The cart products.
 */
export const getCartProducts = createSelector(
  cartItemsSelector,
  cartItems => cartItems.filter(item => item.type === CART_ITEM_TYPE_PRODUCT)
);

/**
 * #####
 * END of the copied block
 * #####
 */

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

export const hasDirectShipItems = createSelector(
  getCartItems,
  cartItems => cartItems.some(item => !item?.fulfillment)
);

export const isDirectShipOnly = createSelector(
  getCartItems,
  cartItems => cartItems.every(item => !item?.fulfillment)
);

/**
 * Returns the currently configured fulfillment slot.
 * Takes the info from either the first cart item
 * or from temp cart state.
 */
export const getActiveFulfillmentSlot = createSelector(
  getCartItems,
  state => getCart(state).activeFulfillmentSlot,
  (cartItems, fulfillmentSlot) => {
    const firstSlotConfig = cartItems
      .find(cartItem => cartItem?.fulfillment)?.[0]?.fulfillment?.fulfillmentSlot;

    if (!firstSlotConfig) {
      return fulfillmentSlot;
    }

    return firstSlotConfig;
  }
);

export const getActiveFulfillmentSlotLocationCode = createSelector(
  getActiveFulfillmentSlot,
  getLocationsStorage,
  (activeFulfillmentSlot, storage) => {
    const slotId = activeFulfillmentSlot?.id;

    if (!slotId) {
      return null;
    }

    const locationId = Object.keys(storage.fulfillmentSlotsByLocation).find(
      locationCode => !!storage.fulfillmentSlotsByLocation[locationCode].find(
        ({ id }) => id === slotId
      )
    );

    return locationId || null;
  }
);

export const checkActiveFulfillmentSlotBelongsToPreferredLocation = createSelector(
  getPreferredLocation,
  getActiveFulfillmentSlotLocationCode,
  (location, activeFulfillmentSlotLocationCode) => {
    const locationCode = location?.code;

    if (!locationCode) {
      return false;
    }

    return locationCode === activeFulfillmentSlotLocationCode;
  }
);
