import { ERROR_PRODUCT_OPTIONS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object} The ERROR_PRODUCT_OPTIONS action.
 */
const errorProductOptions = productId => ({
  type: ERROR_PRODUCT_OPTIONS,
  productId,
});

export default errorProductOptions;
