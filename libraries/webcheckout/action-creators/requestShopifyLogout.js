import { REQUEST_SHOPIFY_LOGOUT } from '../constants';

/**
 * Creates the dispatched REQUEST_SHOPIFY_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
const requestShopifyLogout = () => ({
  type: REQUEST_SHOPIFY_LOGOUT,
});

export default requestShopifyLogout;
