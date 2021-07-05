import { RECEIVE_INVENTORIES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_INVENTORIES action object.
 * @param {Array} productCodes The code of the product.
 * @param {Array} locationCodes List of location codes.
 * @param {Array} inventories List of product invetories.
 * @return {Object} The RECEIVE_PRODUCT_LOCATIONS action.
 */
const receiveInventories = (productInventories) => ({
  type: RECEIVE_INVENTORIES,
  productInventories,
});

export default receiveInventories;
