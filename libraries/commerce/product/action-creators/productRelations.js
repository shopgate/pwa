import {
  REQUEST_PRODUCT_RELATIONS,
  RECEIVE_PRODUCT_RELATIONS,
  ERROR_PRODUCT_RELATIONS,
} from '../constants';

/**
 * Request product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @returns {Object}
 */
export const requestProductRelations = ({ hash }) => ({
  type: REQUEST_PRODUCT_RELATIONS,
  hash,
});

/**
 * Receive product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @param {Object} params.payload Pipeline payload.
 * @returns {Object}
 */
export const receiveProductRelations = ({ hash, payload }) => ({
  type: RECEIVE_PRODUCT_RELATIONS,
  hash,
  payload,
});
/**
 * Error product relations action.
 * @param {Object} params Params.
 * @param {string} params.hash Query hash.
 * @returns {Object}
 */
export const errorProductRelations = ({ hash }) => ({
  type: ERROR_PRODUCT_RELATIONS,
  hash,
});

