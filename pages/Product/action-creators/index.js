import { REQUEST_PRODUCT_DATA } from '../constants';

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
