import { REQUEST_INVENTORIES } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_INVENTORIES action.
 * @param {string} productCode The code of the product to request the inventories for.
 * @param {Array} locationCodes Array of location codes.
 * @return {Object} The REQUEST_PRODUCT_INVENTORIES action.
 */
const requestInventories = (productCode, locationCodes) => ({
  type: REQUEST_INVENTORIES,
  productCode,
  locationCodes,
});

export default requestInventories;
