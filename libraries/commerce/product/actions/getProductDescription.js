import fetchProductDescription from './fetchProductDescription';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 * @deprecated
 */
const getProductDescription = fetchProductDescription;

export default getProductDescription;
