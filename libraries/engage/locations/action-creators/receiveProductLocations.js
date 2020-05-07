import { RECEIVE_PRODUCT_LOCATIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_LOCATIONS action object.
 * @param {string} productId The ID of the product.
 * @param {Array} locations List of product locations.
 * @param {Object} params Additional parameters.
 * @return {Object} The RECEIVE_PRODUCT_LOCATIONS action.
 */
const receiveProductLocations = (productId, locations, params) => ({
  type: RECEIVE_PRODUCT_LOCATIONS,
  productId,
  locations,
  params,
});

export default receiveProductLocations;
