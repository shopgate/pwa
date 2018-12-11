import fetchProductsById from './fetchProductsById';

/**
 * Retrieves products by id from the store.
 * @param {Array} productIds The product id's to request.
 * @param {string} [componentId=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProductsById = fetchProductsById;

export default getProductsById;
