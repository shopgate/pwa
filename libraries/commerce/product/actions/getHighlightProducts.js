import fetchHighlightProducts from './fetchHighlightProducts';

/**
 * Maybe requests highlight products from server.
 * @param {Object} options The options for the fetchProducts request.
 * @param {Object} options.params The params for the getHighlightProducts pipeline.
 * @param {string} [options.id=null] A unique id for the component that is using this action.
 * @return {Function} The dispatched action.
 * @deprecated
 */
const getHighlightProducts = fetchHighlightProducts;

export default getHighlightProducts;
