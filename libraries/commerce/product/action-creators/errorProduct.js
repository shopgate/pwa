import { ERROR_PRODUCT } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @param {string} errorCode error
 * @return {Object} The ERROR_PRODUCT action.
 */
const errorProduct = (productId, errorCode) => ({
  type: ERROR_PRODUCT,
  productId,
  errorCode,
});

export default errorProduct;
