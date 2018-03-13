import { ERROR_PRODUCT_SHIPPING } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @return {Object} The ERROR_PRODUCT_SHIPPING action.
 */
const errorProductShipping = productId => ({
  type: ERROR_PRODUCT_SHIPPING,
  productId,
});

export default errorProductShipping;
