import { SET_COUPON_FIELD_VALUE } from '../constants';

/**
 * Creates the dispatched SET_COUPON_FIELD_VALUE action object.
 * @param {string} value Value
 * @returns {Object} The dispatched action object.
 */
const setCouponFieldValue = (value = '') => ({
  type: SET_COUPON_FIELD_VALUE,
  value,
});

export default setCouponFieldValue;
