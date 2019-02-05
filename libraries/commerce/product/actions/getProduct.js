import fetchProduct from './fetchProduct';

/**
 * Retrieves a product from the Redux store.
 * @param {string} productId The product ID.
 * @param {boolean} [forceFetch=false] Skips shouldFetchData check. Always fetches.
 * @param {boolean} [shouldProcessProductFlags=true] Skips processProductFlags()
 * @return {Function} A redux thunk.
 * @deprecated
 */
const getProduct = fetchProduct;

export default getProduct;
