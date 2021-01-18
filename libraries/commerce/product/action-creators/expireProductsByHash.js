import { EXPIRE_PRODUCTS_BY_HASH } from '../constants';

/**
 * Creates the dispatched EXPIRE_PRODUCTS_BY_HASH action object.
 * @param {string|string[]} hash The hash
 * @returns {Object} The dispatched action object.
 */
const expireProductsByHash = hash => ({
  type: EXPIRE_PRODUCTS_BY_HASH,
  hash,
});

export default expireProductsByHash;
