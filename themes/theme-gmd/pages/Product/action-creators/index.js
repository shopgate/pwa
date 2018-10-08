import {
  REQUEST_PRODUCT_DATA,
  OPEN_PRODUCT_GALLERY,
} from '../constants';

/**
 * Creates the dispatched OPEN_PRODUCT_GALLERY action object.
 * @param {string} productId The ID of the product to request.
 * @param {string} currentSlide The current slide ID.
 * @return {Object} The OPEN_PRODUCT_GALLERY action.
 */
export const openProductGallery = (productId, currentSlide) => ({
  type: OPEN_PRODUCT_GALLERY,
  productId,
  currentSlide,
});

/**
 * Creates the dispatched REQUEST_PRODUCT_DATA action object.
 * @param {string} productId The ID of the product to request.
 * @param {string} selectedVariantId The ID of the selected product variant.
 * @return {Object} The REQUEST_PRODUCT_DATA action.
 */
export const requestProductData = (productId, selectedVariantId) => ({
  type: REQUEST_PRODUCT_DATA,
  productId,
  selectedVariantId,
});
