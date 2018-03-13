import { SUCCESS_ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_PRODUCTS_TO_CART action object.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const successAddProductsToCart = (requestsPending = false) => ({
  type: SUCCESS_ADD_PRODUCTS_TO_CART,
  requestsPending,
});

export default successAddProductsToCart;
