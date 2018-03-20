import { ERROR_ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched ERROR_ADD_PRODUCTS_TO_CART action object.
 * @param {Array} products The products that where supposed to be added within
 *   an ADD_PRODUCTS_TO_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @param {boolean} [requestsPending=false] Tells if other cart related requests are pending.
 * @returns {Object} The dispatched action object.
 */
const errorAddProductsToCart = (products, errors = [], requestsPending = false) => ({
  type: ERROR_ADD_PRODUCTS_TO_CART,
  products,
  errors,
  requestsPending,
});

export default errorAddProductsToCart;
