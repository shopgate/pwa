import { ERROR_PRODUCT_VARIANTS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_VARIANTS action.
 */
const errorProductVariants = (productId, errorCode) => ({
  type: ERROR_PRODUCT_VARIANTS,
  productId,
  errorCode,
});

export default errorProductVariants;
