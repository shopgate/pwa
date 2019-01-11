import { SUCCESS_ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the successful ADD_COUPONS_TO_CART action.
 * @returns {Object} The dispatched action object.
 */
const successAddCouponsToCart = couponsIds => ({
  type: SUCCESS_ADD_COUPONS_TO_CART,
  couponsIds,
});

export default successAddCouponsToCart;
