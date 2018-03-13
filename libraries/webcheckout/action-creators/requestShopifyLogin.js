import { REQUEST_SHOPIFY_LOGIN } from '../constants';

/**
 * Creates the dispatched REQUEST_SHOPIFY_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const requestShopifyLogin = () => ({
  type: REQUEST_SHOPIFY_LOGIN,
});

export default requestShopifyLogin;
