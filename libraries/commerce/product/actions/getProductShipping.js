import fetchProductShipping from './fetchProductShipping';

/**
 * Retrieves product shipping from the store.
 * @param {string} productId The product ID for which the product shipping is requested.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProductShipping = fetchProductShipping;

export default getProductShipping;
