import { ERROR_PRODUCT_IMAGES_RESOLUTIONS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @return {Object} The ERROR_PRODUCT_IMAGES action.
 */
const errorProductImagesResolutions = productId => ({
  type: ERROR_PRODUCT_IMAGES_RESOLUTIONS,
  productId,
});

export default errorProductImagesResolutions;
