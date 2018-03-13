import { REQUEST_PRODUCT } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT action object.
 * @param {string} productId The ID of the product to request.
 * @return {Object} The REQUEST_PRODUCT action.
 */
const requestProduct = productId => ({
  type: REQUEST_PRODUCT,
  productId,
});

export default requestProduct;
