import { CLEAR_CHECKOUT_CAMPAIGN } from '../constants/actionTypes';

/**
 * Creates the dispatched CLEAR_CHECKOUT_CAMPAIGN action object.
 * @param {Object} data The received client information data.
 * @returns {Object} The dispatched action object.
 */
export const clearCheckoutCampaign = () => ({
  type: CLEAR_CHECKOUT_CAMPAIGN,
});
