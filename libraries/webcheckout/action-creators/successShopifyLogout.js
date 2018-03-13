import { SUCCESS_SHOPIFY_LOGOUT } from '../constants';

/**
 * Creates the dispatched SUCCESS_SHOPIFY_LOGOUT action object.
 * @returns {Object} The dispatched action object.
 */
const successShopifyLogout = () => ({
  type: SUCCESS_SHOPIFY_LOGOUT,
});

export default successShopifyLogout;
