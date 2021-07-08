import { ERROR_INVENTORIES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_INVENTORIES action object.
 * @param {string} productId The ID of the product.
 * @param {Array} locationCodes List of location codes.
 * @param {Error} error error
 * @return {Object} The ERROR_PRODUCT_LOCATIONS action.
 */
const errorInventories = (productId, locationCodes, error) => ({
  type: ERROR_INVENTORIES,
  productId,
  locationCodes,
  error,
});

export default errorInventories;
