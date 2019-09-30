import SgTrackingPlugin from '@shopgate/tracking-core/plugins/Base';
import { SGLink } from '@shopgate/tracking-core/helpers/helper';

/**
 * List of public custom events
 * @type {[*]}
 */
const publicCustomEvents = [
  'qrScanner',
  'adScanner',
  'ccScanner',
];

/**
 * List of events intended to be sent just to shopgate tracker
 * @type {[*]}
 */
const shopgateCustomEvents = [
  'scrollTop',
  'filterLiveSuggest',
  'openDeepLink',
  'openUniversalLink',
  'openDeferredDeepLink',
  'openSmartAppDownloadLink',
  'openPushNotification',
  'appReviewPrompt',
];

/**
 * Tracking Plugin google native tracking system intended to handle just internal trackers
 */
class SgGoogleNative extends SgTrackingPlugin {
  /**
   * Constructor
   * @param {Object} [options] configuration
   */
  constructor(options = {}) {
    const trackerName = options.trackerName || 'gaNative';
    // Invoke the parent constructor
    super(trackerName, options);

    this.isMerchant = trackerName !== 'gaNative';

    this.cmdParams = {
      blacklist: false,
      trackers: [this.trackerName],
    };

    this.registerEvents();
  }

  /**
   * Prepares custom event params (for analyticsLogEvent command)
   * @param {string} name Name of the event
   * @param {Object} data Data of the event
   * @return {{shortName: *, category: *, action, name: *}}
   */
  static getCustomEventParams(name, data) {
    const label = data.eventLabel ? data.eventLabel : name;
    return {
      shortName: name,
      category: name,
      action: data.eventAction,
      name: label,
    };
  }

  /**
   * Register the plugin for events
   */
  registerEvents() {
    /**
     * Page view which gets data for viewContent and triggers pageView cmd with whitelist.
     *
     * @return {boolean} MUST return false so it won't be processed via unified
     */
    this.register.pageview((data, raw) => {
      const formattedData = SgTrackingPlugin.formatData('viewContent', raw);
      if (!this.isMerchant || !formattedData.id) {
        formattedData.id = formattedData.type;
      }

      // Some more sanitization
      const specialTypes = [
        'cart',
        'favourite_list',
      ];
      if (specialTypes.indexOf(formattedData.type) > -1) {
        formattedData.id = this.isMerchant ? data.page.merchantUrl : data.page.shopgateUrl;
      }

      this.appHandler.viewContent(formattedData, this.cmdParams);

      return false;
    });

    /**
     * Register for the setCampaignWithUrl event and triggers the appHandler
     *
     * For deeplinks and universal links we should not change the original url when tracking
     * to merchant's account.
     * Those links can come from the wild, we have no idea if they already contain some
     * utm params, therefore no change here.
     *
     * For PushMessage there is also no need to change that, merchant can set his/her own
     * campaign name in the merchant admin, or it's set to default when sending a push.
     *
     * We change it for our own account by adding a notification id, because we PULL the data
     * afterwards from Google, and show the stats in the merchant admin area.
     *
     * For branch.io links we should add utm_params if it's not set previously by the merchant.
     *
     * @return {boolean} MUST return false so it won't be processed via unified
     */
    this.register.setCampaignWithUrl((data, raw) => {
      const finalData = {
        url: data.url,
      };

      if (!this.isMerchant) {
        const shopgateUrl = new SGLink(data.url);
        shopgateUrl.setUtmParams(data, raw);
        finalData.url = shopgateUrl.toString();
      }

      this.appHandler.setCampaignWithUrl(finalData, this.cmdParams);

      return false;
    });

    /**
     * This should not do anything except return false.
     *
     * The only reason for it is to give a single to tracking-plugin to
     * build a right blacklist for viewContent events, since viewContent is
     * actually sending pageView.
     */
    this.register.viewContent(() => false);

    if (typeof this.register.customEvent === 'function') {
      this.register.customEvent((data) => {
        this.sendCustomEventCommand(data.eventCategory, data);
        return false;
      });
    }

    /*
     * Custom events starts here
     */
    publicCustomEvents.forEach((name) => {
      this.register[name]((data) => {
        this.sendCustomEventCommand(name, data);
        return false;
      });
    });

    shopgateCustomEvents.forEach((name) => {
      this.register[name]((data) => {
        if (this.isMerchant) {
          return false;
        }

        this.sendCustomEventCommand(name, data);

        return false;
      });
    });
  }

  /**
   * Sends custom event command with given name and params (just event params)
   * @param {string} name Name of the event
   * @param {Object} data Data of the event
   */
  sendCustomEventCommand(name, data) {
    const eventData = SgGoogleNative.getCustomEventParams(name, data);
    this.appHandler.logEvent(eventData, this.cmdParams);
  }
}

export default SgGoogleNative;

window.SgGoogleNative = SgGoogleNative;
