import { ERROR_PRODUCT_INVENTORIES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_INVENTORIES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} locationCodes List of location codes.
 * @param {string} errorCode errorCode
 * @return {Object} The ERROR_PRODUCT_LOCATIONS action.
 */
const errorProductInventories = (productId, locationCodes, errorCode) => ({
  type: ERROR_PRODUCT_INVENTORIES,
  productId,
  locationCodes,
  errorCode,
});

export default errorProductInventories;
