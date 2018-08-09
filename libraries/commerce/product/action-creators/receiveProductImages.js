import { RECEIVE_PRODUCT_IMAGES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_IMAGES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} productImages List of product images (array of strings).
 * @param {Array} productOptimizedImages List of product optimized images (array of objects).
 * @return {Object} The RECEIVE_PRODUCT_IMAGES action.
 */
const receiveProductImages = (productId, productImages, productOptimizedImages) => ({
  type: RECEIVE_PRODUCT_IMAGES,
  productId,
  productImages,
  productOptimizedImages,
});

export default receiveProductImages;
