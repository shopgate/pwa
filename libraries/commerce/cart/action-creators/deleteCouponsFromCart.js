import { DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
const deleteCouponsFromCart = couponIds => ({
  type: DELETE_COUPONS_FROM_CART,
  couponIds,
});

export default deleteCouponsFromCart;
