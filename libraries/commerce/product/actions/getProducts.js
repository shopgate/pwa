import fetchProducts from './fetchProducts';

/**
 * Retrieves a product from the Redux store.
 * @param {Object} options The options for the getProducts request.
 * @param {Object} options.params The params for the getProduct pipeline.
 * @param {string} [options.pipeline='getProducts'] The pipeline to call.
 * @param {boolean} [options.cached=true] If the result will be cached.
 * @param {null|string} [options.id=null] A unique id for the component that is using this action.
 * @param {boolean} [options.includeSort=true] Tells if the sort parameters shall be included
 *   into the product hash and the request.
 * @param {boolean} [options.includeFilters=true] Tells if the filter parameters shall be included
 *   into the product hash and the request.
 * @param {Function} [options.onBeforeDispatch=() => {}] A callback which is fired, before new data
 *  will be returned.
 * @return {Function} A Redux Thunk
 * @deprecated
 */
const getProducts = fetchProducts;

export default getProducts;
