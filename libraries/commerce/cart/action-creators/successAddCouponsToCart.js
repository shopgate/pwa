import { SUCCESS_ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the successful ADD_COUPONS_TO_CART action.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const successAddCouponsToCart = (couponsIds, requestsPending = false) => ({
  type: SUCCESS_ADD_COUPONS_TO_CART,
  couponsIds,
  requestsPending,
});

export default successAddCouponsToCart;
