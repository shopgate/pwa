import { SET_PRODUCT_QUANTITY } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_QUANTITY action object.
 * @param {number} quantity The product variant id.
 * @returns {Object} The dispatched action object.
 */
const setProductQuantity = quantity => ({
  type: SET_PRODUCT_QUANTITY,
  quantity,
});

export default setProductQuantity;
