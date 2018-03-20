import { ERROR_SHOPIFY_LOGIN } from '../constants';

/**
 * Creates the dispatched ERROR_SHOPIFY_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const errorShopifyLogin = () => ({
  type: ERROR_SHOPIFY_LOGIN,
});

export default errorShopifyLogin;
