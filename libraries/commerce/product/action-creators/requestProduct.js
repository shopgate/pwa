import { REQUEST_PRODUCT } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT action object.
 * @param {string} productId The ID of the product to request.
 * @param {boolean} forceFetch flag
 * @return {Object} The REQUEST_PRODUCT action.
 */
const requestProduct = (productId, forceFetch = false) => ({
  type: REQUEST_PRODUCT,
  productId,
  forceFetch,
});

export default requestProduct;
