import { EXPIRE_PRODUCT_DATA } from '../constants';

/**
 * Dispatches the EXPIRE_PRODUCT_DATA action object.
 * Depending on the provided scopes, it will mark different types of product data as expired which
 * will trigger a refetch of that data when needed.
 * @param {Object} [options] The options object.
 * @param {("price"|"media"|"description")[]} [options.scopes=[]] The scopes to apply the action to.
 * @return {Object} The EXPIRE_PRODUCT_DATA action.
 */
const expireProductData = ({ scopes = [] } = {}) => ({
  type: EXPIRE_PRODUCT_DATA,
  scopes,
});

export default expireProductData;
