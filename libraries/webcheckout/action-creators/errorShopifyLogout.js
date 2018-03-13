import { ERROR_SHOPIFY_LOGOUT } from '../constants';

/**
 * Creates the dispatched ERROR_SHOPIFY_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
const errorShopifyLogout = () => ({
  type: ERROR_SHOPIFY_LOGOUT,
});

export default errorShopifyLogout;
