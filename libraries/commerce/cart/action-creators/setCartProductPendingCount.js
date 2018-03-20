import { SET_CART_PENDING_PRODUCT_COUNT } from '../constants';

/**
 * Creates the dispatched SET_CART_PENDING_PRODUCT_COUNT object.
 * @param {number} count The cart product count.
 * @return {Object} The SET_CART_PENDING_PRODUCT_COUNT action.
 */
const setCartProductPendingCount = count => ({
  type: SET_CART_PENDING_PRODUCT_COUNT,
  count,
});

export default setCartProductPendingCount;
