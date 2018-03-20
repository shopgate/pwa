import { ERROR_PRODUCT_PROPERTIES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that received properties.
 * @return {Object} The ERROR_PRODUCT_PROPERTIES action.
 */
const errorProductProperties = productId => ({
  type: ERROR_PRODUCT_PROPERTIES,
  productId,
});

export default errorProductProperties;
