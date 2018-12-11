import fetchProductProperties from './fetchProductProperties';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 * @deprecated
 */
const getProductProperties = fetchProductProperties;

export default getProductProperties;
