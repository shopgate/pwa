import { SUCCESS_CHECKOUT } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @param {Object[]} products cart.items of product type
 * @returns {Object} The dispatched action object.
 */
const successCheckout = products => ({
  type: SUCCESS_CHECKOUT,
  products,
});

export default successCheckout;
