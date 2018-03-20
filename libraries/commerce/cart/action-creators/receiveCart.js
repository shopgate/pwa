import { RECEIVE_CART } from '../constants';

/**
 * Creates the dispatched RECEIVE_CART action object
 * @param {Object} cart The cart data
 * @return {Object} The RECEIVE_CART action.
 */
const receiveCart = cart => ({
  type: RECEIVE_CART,
  cart,
});

export default receiveCart;
