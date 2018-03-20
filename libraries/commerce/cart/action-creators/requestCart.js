import { REQUEST_CART } from '../constants';

/**
 * Creates the dispatched REQUEST_CART action object.
 * @return {Object} The REQUEST_CART action.
 */
const requestCart = () => ({
  type: REQUEST_CART,
});

export default requestCart;
