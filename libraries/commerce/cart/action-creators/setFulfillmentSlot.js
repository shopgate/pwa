import { SET_FULFILLMENT_SLOT } from '../constants';

/**
 * Creates the dispatched DELETE_COUPONS_FROM_CART action object.
 * @param {Object} fulfillmentSlot Fulfillment slot.
 * @returns {Object} The dispatched action object.
 */
const setFulfillmentSlot = fulfillmentSlot => ({
  type: SET_FULFILLMENT_SLOT,
  fulfillmentSlot,
});

export default setFulfillmentSlot;
