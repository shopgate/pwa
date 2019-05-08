import { ERROR_PRODUCT_IMAGES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_IMAGES action.
 */
const errorProductImages = (productId, errorCode) => ({
  type: ERROR_PRODUCT_IMAGES,
  productId,
  errorCode,
});

export default errorProductImages;
