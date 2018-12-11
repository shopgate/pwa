import fetchProduct from './fetchProduct';

/**
 * Retrieves a product from the Redux store.
 * @param {string} productId The product ID.
 * @param {boolean} forceFetch Skips shouldFetchData check. Always fetches.
 * @return {Function} A redux thunk.
 * @deprecated
 */
const getProduct = fetchProduct;

export default getProduct;
