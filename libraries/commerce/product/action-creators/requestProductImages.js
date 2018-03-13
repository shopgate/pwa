import { REQUEST_PRODUCT_IMAGES } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_IMAGES action.
 * @param {string} productId The ID of the product to request the images.
 * @return {Object} The REQUEST_PRODUCT_IMAGES action.
 */
const requestProductImages = productId => ({
  type: REQUEST_PRODUCT_IMAGES,
  productId,
});

export default requestProductImages;
