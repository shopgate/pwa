import { SGAction } from '../helpers/helper';

/**
 * Handler for the communication between the tracking plugins and the app.
 */
class AppHandler {
  /**
   * Log a pageview
   *
   * @param {UnifiedPageview} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  viewContent(data, restrictions) {
    SGAction.analyticsLogPageview(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * AnalyticsLogEvent
   * @param {UnifiedPageview} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  logEvent(data, restrictions) {
    SGAction.analyticsLogEvent(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log a purchase
   *
   * @param {UnifiedPurchase} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  purchase(data, restrictions) {
    SGAction.analyticsLogPurchase(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when a product was added to the cart
   *
   * @param {UnifiedAddToCart} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  addToCart(data, restrictions) {
    SGAction.analyticsLogAddToCart(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when a payment info was added
   *
   * @param {UnifiedAddedPaymentInfo} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  addedPaymentInfo(data, restrictions) {
    SGAction.analyticsLogAddedPaymentInfo(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when a checkout is initiated
   *
   * @param {UnifiedInitiatedCheckout} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  initiatedCheckout(data, restrictions) {
    SGAction.analyticsLogInitiatedCheckout(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log if a registration was completed
   *
   * @param {UnifiedCompletedRegistration} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  completedRegistration(data, restrictions) {
    SGAction.analyticsLogCompletedRegistration(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when a product was added to the wishlist
   *
   * @param {UnifiedAddToWishlist} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  addToWishlist(data, restrictions) {
    SGAction.analyticsLogAddToWishlist(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when a search happend
   *
   * @param {UnifiedSearched} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  search(data, restrictions) {
    SGAction.analyticsLogSearch(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log when Deeplink and etc opened
   * @param {Object} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  setCampaignWithUrl(data, restrictions) {
    SGAction.analyticsSetCampaignWithUrl(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Log an itemview
   *
   * @param {UnifiedItemView} data Tracking data for this event
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {AppHandler} Instance of SgTrackingAppHandler
   */
  logItemView(data, restrictions) {
    SGAction.analyticsLogItemView(AppHandler.prepareTrackingData(data, restrictions));
    return this;
  }

  /**
   * Add the properties restriction, blacklist and trackers to the tracking event data if needed
   *
   * @param {Object} data The tracking event data
   * @param {UnifiedRestrictions} [restrictions] Info about the restrictions
   * @returns {Object} Tracking data with restrictions
   * @private
   */
  static prepareTrackingData(data, restrictions) {
    // Clone the data to avoid issues with references.
    const clonedData = { ...data };

    if (restrictions && restrictions.trackers) {
      let trackerParamName = 'trackers';

      // There is a Bug in the iOS app. Lib Version <= 9.0 expects "tracker" as the param name.
      if (
        window.LibShopgateClient &&
        window.LibShopgateClient.isIos() &&
        window.LibShopgateVersion &&
        window.LibShopgateVersion.isLibVersionAtMost(9)
      ) {
        trackerParamName = 'tracker';
      }

      // Add the restrictions to the tracking event data.
      clonedData.restrictions = {
        blacklist: restrictions.blacklist,
        [trackerParamName]: restrictions.trackers,
      };
    }

    return clonedData;
  }
}

export default new AppHandler();
