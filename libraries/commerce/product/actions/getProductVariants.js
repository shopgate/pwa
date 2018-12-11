import fetchProductVariants from './fetchProductVariants';

/**
 * Retrieves product variants from store.
 * @param {string} productId The product ID for which the product variants are requested.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProductVariants = fetchProductVariants;

export default getProductVariants;
