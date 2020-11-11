import { ADD_CHECKOUT_CAMPAIGN } from '../constants/actionTypes';

/**
 * Creates the dispatched ADD_CHECKOUT_CAMPAIGN action object.
 * @param {Object} data The campaign data
 * @returns {Object} The dispatched action object.
 */
export const addCheckoutCampaign = (data = {}) => ({
  type: ADD_CHECKOUT_CAMPAIGN,
  data,
});
