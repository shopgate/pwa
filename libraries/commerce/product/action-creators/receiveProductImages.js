import { RECEIVE_PRODUCT_IMAGES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} productImages List of product images.
 * @return {Object} The RECEIVE_PRODUCT_IMAGES action.
 */
const receiveProductImages = (productId, productImages) => ({
  type: RECEIVE_PRODUCT_IMAGES,
  productId,
  productImages,
});

export default receiveProductImages;
