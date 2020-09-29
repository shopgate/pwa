import { SUCCESS_ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the successful ADD_COUPONS_TO_CART action.
 * @param {boolean} [userInteracted=true] Was the action dispatched due to a user interaction
 * @returns {Object} The dispatched action object.
 */
const successAddCouponsToCart = (couponsIds, userInteracted = true) => ({
  type: SUCCESS_ADD_COUPONS_TO_CART,
  couponsIds,
  userInteracted,
});

export default successAddCouponsToCart;
