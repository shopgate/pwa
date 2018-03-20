import { ERROR_CART } from '../constants';

/**
 * Creates the dispatched ERROR_CART action object.
 * @return {Object} The ERROR_CART action.
 */
const errorCart = () => ({
  type: ERROR_CART,
});

export default errorCart;
