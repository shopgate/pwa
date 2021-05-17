import { RECEIVE_PRODUCT_INVENTORIES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_INVENTORIES action object.
 * @param {string} productCode The code of the product.
 * @param {Array} locationCodes List of location codes.
 * @param {Array} inventories List of product invetories.
 * @return {Object} The RECEIVE_PRODUCT_LOCATIONS action.
 */
const receiveProductInventories = (productCode, locationCodes, inventories) => ({
  type: RECEIVE_PRODUCT_INVENTORIES,
  productCode,
  locationCodes,
  inventories,
});

export default receiveProductInventories;
