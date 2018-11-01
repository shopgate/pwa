import { REQUEST_PRODUCT_IMAGES_RESOLUTIONS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_IMAGES_RESOLUTIONS action.
 * @param {string} productId The ID of the product to request the images.
 * @param {Array} resolutions The resolutions to request 
 * @return {Object} The REQUEST_PRODUCT_IMAGES_RESOLUTIONS action.
 */
const requestProductImagesResolutions = (productId, resolutions) => ({
  type: REQUEST_PRODUCT_IMAGES_RESOLUTIONS,
  productId,
  resolutions
});

export default requestProductImagesResolutions;
