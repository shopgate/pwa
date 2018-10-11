import { RECEIVE_PRODUCT_RELATIONS } from '../constants';

/**
 * Receive product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @param {Object} params.payload Pipeline payload.
 * @returns {Object}
 */
export default ({ hash, payload }) => ({
  type: RECEIVE_PRODUCT_RELATIONS,
  hash,
  payload,
});
