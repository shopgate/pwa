import fetchProductOptions from './fetchProductOptions';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProductOptions = fetchProductOptions;

export default getProductOptions;
