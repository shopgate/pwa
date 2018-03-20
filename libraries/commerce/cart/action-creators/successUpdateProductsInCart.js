import { SUCCESS_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const successUpdateProductsInCart = (requestsPending = false) => ({
  type: SUCCESS_UPDATE_PRODUCTS_IN_CART,
  requestsPending,
});

export default successUpdateProductsInCart;
