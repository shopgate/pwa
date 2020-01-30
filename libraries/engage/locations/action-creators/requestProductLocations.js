import { REQUEST_PRODUCT_LOCATIONS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_LOCATIONS action.
 * @param {string} productId The ID of the product to request the locations for.
 * @return {Object} The REQUEST_PRODUCT_LOCATIONS action.
 */
const requestProductLocations = productId => ({
  type: REQUEST_PRODUCT_LOCATIONS,
  productId,
});

export default requestProductLocations;
