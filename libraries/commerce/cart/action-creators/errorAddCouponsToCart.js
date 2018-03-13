import { ERROR_ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched ERROR_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed ADD_COUPONS_TO_CART action.
 * @param {Array} [errors] A list of errors messages for the coupons.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const errorAddCouponsToCart = (couponsIds, errors = [], requestsPending = false) => ({
  type: ERROR_ADD_COUPONS_TO_CART,
  couponsIds,
  errors,
  requestsPending,
});

export default errorAddCouponsToCart;
