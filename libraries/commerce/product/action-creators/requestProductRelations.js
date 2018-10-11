import { REQUEST_PRODUCT_RELATIONS } from '../constants';

/**
 * Request product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @returns {Object}
 */
export default ({ hash }) => ({
  type: REQUEST_PRODUCT_RELATIONS,
  hash,
});
