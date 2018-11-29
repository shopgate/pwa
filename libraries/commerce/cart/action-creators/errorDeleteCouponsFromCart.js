import { ERROR_DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched ERROR_DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed DELETE_COUPONS_FROM_CART action.
 * @param {Array} [errors] A list of errors messages for the coupons.
 * @returns {Object} The dispatched action object.
 */
const errorDeleteCouponsFromCart = (couponsIds, errors = []) => ({
  type: ERROR_DELETE_COUPONS_FROM_CART,
  couponsIds,
  errors,
});

export default errorDeleteCouponsFromCart;
