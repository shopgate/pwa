import { ERROR_ADD_COUPONS_TO_CART } from '../constants';

/**
 * Creates the dispatched ERROR_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed ADD_COUPONS_TO_CART action.
 * @param {PipelineErrorElement[]} [errors] A list of errors messages for the coupons.
 * @returns {Object} The dispatched action object.
 */
const errorAddCouponsToCart = (couponsIds, errors = []) => ({
  type: ERROR_ADD_COUPONS_TO_CART,
  couponsIds,
  errors,
});

export default errorAddCouponsToCart;
