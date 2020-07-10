import { RECEIVE_PRODUCT_LOCATIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_LOCATIONS action object.
 * @param {string} productCode The ID of the product.
 * @param {Object} [filters={}] Additional parameters.
 * @param {Array} locations List of product locations.
 * @return {Object} The RECEIVE_PRODUCT_LOCATIONS action.
 */
const receiveProductLocations = (productCode, filters, locations) => ({
  type: RECEIVE_PRODUCT_LOCATIONS,
  productCode,
  filters,
  locations,
});

export default receiveProductLocations;
