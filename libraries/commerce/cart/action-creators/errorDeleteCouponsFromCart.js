import { ERROR_DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched ERROR_DELETE_COUPONS_FROM_CART action object.
 * @param {string[]} couponIds The coupon ids from the failed DELETE_COUPONS_FROM_CART action.
 * @param {PipelineErrorElement[]} [errors] A list of errors messages for the coupons.
 * @returns {Object} The dispatched action object.
 */
const errorDeleteCouponsFromCart = (couponIds, errors = []) => ({
  type: ERROR_DELETE_COUPONS_FROM_CART,
  couponIds,
  errors,
});

export default errorDeleteCouponsFromCart;
