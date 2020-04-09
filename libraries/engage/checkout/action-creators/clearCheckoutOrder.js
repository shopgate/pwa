import { CLEAR_CHECKOUT_ORDER } from '../constants/actionTypes';

/**
 * Creates the dispatched CLEAR_CHECKOUT_ORDER action object.
 * @param {Object} data The received client information data.
 * @returns {Object} The dispatched action object.
 */
export const clearCheckoutOrder = () => ({
  type: CLEAR_CHECKOUT_ORDER,
});
