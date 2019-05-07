import { ERROR_PRODUCT_OPTIONS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_OPTIONS action.
 */
const errorProductOptions = (productId, errorCode) => ({
  type: ERROR_PRODUCT_OPTIONS,
  productId,
  errorCode,
});

export default errorProductOptions;
