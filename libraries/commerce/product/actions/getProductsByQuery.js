import fetchProductsByQuery from './fetchProductsByQuery';

/**
 * Dispatches other actions based on the query type.
 * @param {string} type The query type.
 * @param {string} value The value to use with the query.
 * @param {Object} options Any additional options for requesting products.
 * @param {string} [id=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProductsByQuery = fetchProductsByQuery;

export default getProductsByQuery;
