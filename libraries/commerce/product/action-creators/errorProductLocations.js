import { ERROR_PRODUCT_LOCATIONS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_LOCATIONS action object.
 * @param {string} productId The ID of the product.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_LOCATIONS action.
 */
const errorProductLocations = (productId, errorCode) => ({
  type: ERROR_PRODUCT_LOCATIONS,
  productId,
  errorCode,
});

export default errorProductLocations;
