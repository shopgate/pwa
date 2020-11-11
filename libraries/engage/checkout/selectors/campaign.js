import { createSelector } from 'reselect';

/**
 * Returns all checkout campaign data
 * @param {Object} state The application state.
 * @returns {Array}
 */
export const getCheckoutCampaign = state => state.checkout.checkoutCampaign;

export const getCampaignAttribution = createSelector(
  getCheckoutCampaign,
  (campaign) => {
    const { campaignCode, channel, distributionIndex } = campaign;

    if (!campaignCode) {
      return null;
    }

    return {
      campaignCode,
      channel,
      distributionIndex,
    };
  }
);
