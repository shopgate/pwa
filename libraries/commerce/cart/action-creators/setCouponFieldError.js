import { SET_COUPON_FIELD_ERROR } from '../constants';

/**
 * Creates the dispatched SET_COUPON_FIELD_ERROR action object.
 * @param {string} message The error message
 * @returns {Object} The dispatched action object.
 */
const setCouponFieldError = (message = '') => ({
  type: SET_COUPON_FIELD_ERROR,
  message,
});

export default setCouponFieldError;
