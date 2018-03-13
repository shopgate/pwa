import { REQUEST_PRODUCT_PROPERTIES } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that requests properties.
 * @return {Object} The REQUEST_PRODUCT_PROPERTIES action.
 */
const requestProductProperties = productId => ({
  type: REQUEST_PRODUCT_PROPERTIES,
  productId,
});

export default requestProductProperties;
