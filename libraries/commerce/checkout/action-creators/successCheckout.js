import { SUCCESS_CHECKOUT } from '../constants';
import { getCartProducts } from '../../cart/selectors';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successCheckout = ({ getState }) => ({
  type: SUCCESS_CHECKOUT,
  products: getCartProducts(getState()),
});

export default successCheckout;
