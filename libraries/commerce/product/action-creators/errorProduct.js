import { ERROR_PRODUCT } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @return {Object} The ERROR_PRODUCT action.
 */
const errorProduct = productId => ({
  type: ERROR_PRODUCT,
  productId,
});

export default errorProduct;
