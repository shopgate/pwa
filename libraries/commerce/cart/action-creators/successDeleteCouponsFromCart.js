import { SUCCESS_DELETE_COUPONS_FROM_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_DELETE_COUPONS_FROM_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successDeleteCouponsFromCart = () => ({
  type: SUCCESS_DELETE_COUPONS_FROM_CART,
});

export default successDeleteCouponsFromCart;
