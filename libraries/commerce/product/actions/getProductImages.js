import fetchProductImages from './fetchProductImages';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 * @deprecated
 */
const getProductImages = fetchProductImages;

export default getProductImages;
