import { ERROR_PRODUCT_RELATIONS } from '../constants';
/**
 * Error product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @returns {Object}
 */
export default ({ hash }) => ({
  type: ERROR_PRODUCT_RELATIONS,
  hash,
});
