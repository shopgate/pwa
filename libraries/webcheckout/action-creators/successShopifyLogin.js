import { SUCCESS_SHOPIFY_LOGIN } from '../constants';

/**
 * Creates the dispatched SUCCESS_SHOPIFY_LOGIN action object.
 * @returns {Object} The dispatched action object.
 */
const successShopifyLogin = () => ({
  type: SUCCESS_SHOPIFY_LOGIN,
});

export default successShopifyLogin;
