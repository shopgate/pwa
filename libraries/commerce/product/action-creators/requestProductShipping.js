import { REQUEST_PRODUCT_SHIPPING } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @return {Object} The REQUEST_PRODUCT_SHIPPING action.
 */
const requestProductShipping = productId => ({
  type: REQUEST_PRODUCT_SHIPPING,
  productId,
});

export default requestProductShipping;
