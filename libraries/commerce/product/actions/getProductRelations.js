import fetchProductRelations from './fetchProductRelations';

/**
 * Action starts product relation fetching process.
 * Returns early if product relation cache is still valid.
 * @param {Object} params Params.
 * @param {string} params.productId Product Id.
 * @param {string} params.type Type (see constants).
 * @param {number} params.limit Query limit.
 * @returns {Function}
 * @deprecated
 */
const getProductRelations = fetchProductRelations;

export default getProductRelations;
