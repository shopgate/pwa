import { RECEIVE_PRODUCT_IMAGES_RESOLUTIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_IMAGES_RESOLUTION action object.
 * @param {string} productId The ID of the product.
 * @param {Array} resolutions List of image resolutions.
 * @return {Object} The RECEIVE_PRODUCT_IMAGES_RESOLUTION action.
 */
const receiveProductImagesResolutions = (productId, resolutions) => ({
  type: RECEIVE_PRODUCT_IMAGES_RESOLUTIONS,
  productId,
  resolutions,
});

export default receiveProductImagesResolutions;
