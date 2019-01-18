import { SUCCESS_CHECKOUT } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @param {Object} cartProducts Products that were in the cart before the checkout was done
 * @returns {Object} The dispatched action object.
 */
const successCheckout = cartProducts => ({
  type: SUCCESS_CHECKOUT,
  products: cartProducts,
});

export default successCheckout;
