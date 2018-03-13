import { ERROR_PRODUCT_IMAGES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @return {Object} The ERROR_PRODUCT_IMAGES action.
 */
const errorProductImages = productId => ({
  type: ERROR_PRODUCT_IMAGES,
  productId,
});

export default errorProductImages;
