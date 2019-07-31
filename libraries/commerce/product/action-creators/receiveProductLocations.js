import { RECEIVE_PRODUCT_LOCATIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_LOCATIONS action object.
 * @param {string} productId The ID of the product.
 * @param {Array} locations List of product locations.
 * @return {Object} The RECEIVE_PRODUCT_LOCATIONS action.
 */
const receiveProductLocations = (productId, locations) => ({
  type: RECEIVE_PRODUCT_LOCATIONS,
  productId,
  locations,
});

export default receiveProductLocations;
