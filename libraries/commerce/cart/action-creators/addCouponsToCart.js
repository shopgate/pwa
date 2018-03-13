import { ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched ADD_COUPONS_TO_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
const addCouponsToCart = couponIds => ({
  type: ADD_COUPONS_TO_CART,
  couponIds,
});

export default addCouponsToCart;
