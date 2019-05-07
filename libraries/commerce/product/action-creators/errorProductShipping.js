import { ERROR_PRODUCT_SHIPPING } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_SHIPPING action.
 */
const errorProductShipping = (productId, errorCode) => ({
  type: ERROR_PRODUCT_SHIPPING,
  productId,
  errorCode,
});

export default errorProductShipping;
