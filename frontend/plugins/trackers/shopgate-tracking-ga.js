import SgTrackingPlugin from '../shopgate-tracking-plugin';
import SgGAUniversalTracking from './shopgate-tracking-ga-universal';
import SgGAClassicTracking from './shopgate-tracking-ga-classic';

const TRACK_PAGE_VIEW = 'pageView';
const TRACK_EVENT = 'event';
const TRACK_SET = 'set';
const TRACK_REQUIRE = 'require';
const TRACK_CONVERSION = {
  ADDITEM: 'addItem',
  CURRENCY: 'currencyCode',
  END: 'trackTrans',
  START: 'addTrans',
};

const ACCOUNT_CLASSIC = 'classic';
const ACCOUNT_UNIVERSAL = 'universal';

const shopgateOnly = {
  merchant: false,
  shopgate: true,
};

const merchantOnly = {
  merchant: true,
  shopgate: false,
};

// command mapping tuple, [classic, universal]
const commandMapping = {};
commandMapping[TRACK_PAGE_VIEW] = ['trackPageview', 'pageview'];
commandMapping[TRACK_EVENT] = ['trackEvent', 'event'];
commandMapping[TRACK_SET] = ['set'];
commandMapping[TRACK_CONVERSION.ADDITEM] = ['addItem', 'ecommerce:addItem'];
commandMapping[TRACK_CONVERSION.CURRENCY] = ['currencyCode'];
commandMapping[TRACK_CONVERSION.END] = ['trackTrans', 'ecommerce:send'];
commandMapping[TRACK_CONVERSION.START] = ['addTrans', 'ecommerce:addTransaction'];
commandMapping[TRACK_REQUIRE] = [undefined, 'require'];

/**
 * Parent Tracking plugin for Google Analytics
 */
class SgGATracking extends SgTrackingPlugin {
  /**
   * Tracking plugin for Facebook
   */
  constructor() {
    super('GAcore', {});

    // universal and classic merchant and shopgate accounts
    this.accounts = [];

    this.isRegistered = false;

    this.universalPlugin = null;
    this.classicPlugin = null;
  }

  /**
   * Returns common data for a custom event
   * @param {string} name Event category
   * @param {Object} data Input
   * @returns {{
   *   eventCategory: (string),
   *   eventAction: (string),
   *   eventLabel: (null|string),
   *   eventValue: (null|number),
   *   nonInteraction: (boolean)
   * }}
   * @private
   */
  static getEventData(name, data) {
    return {
      eventCategory: name,
      eventAction: data.eventAction,
      eventLabel: data.eventLabel,
      eventValue: data.eventValue,
      nonInteraction: data.nonInteraction,
    };
  }

  /**
   * Send command to both universal and classic sdk
   *
   * @param {string} command Name of the command
   * @param {Object|Array|string|Function} [payload] Data for the command,
   *   or a function that returns data
   * @param {Object} [scope] Scope (merchant or shopgate account)
   * @param {string} [account] Which account to use, classic or universal
   * @private
   */
  sendCommand(command, payload, scope, account) {
    if (typeof commandMapping[command] === 'undefined') {
      console.warn(`SgGATracking: Unknown google analytics command "${command}"`);
      return;
    }

    // Evaluate which accounts to send to.
    const isClassic = (typeof account === 'undefined' || account === ACCOUNT_CLASSIC);
    const isUniversal = (typeof account === 'undefined' || account === ACCOUNT_UNIVERSAL);

    if (isUniversal && this.universalPlugin !== null) {
      this.universalPlugin.send(commandMapping[command][1], payload, scope);
    }
    if (isClassic && this.classicPlugin !== null) {
      this.classicPlugin.send(commandMapping[command][0], payload, scope);
    }
  }

  /**
   * Helper to register for some events
   * @private
   */
  registerEvents() {
    if (this.isRegistered) {
      return;
    }

    this.isRegistered = true;

    // Handle pageview event for shopgate accounts
    this.register.pageview((data) => {
      this.sendCommand(TRACK_PAGE_VIEW, data.page.shopgateUrl, shopgateOnly);
    }, shopgateOnly);

    // Handle pageview event for merchant account
    this.register.pageview((data) => {
      this.sendCommand(TRACK_PAGE_VIEW, data.page.merchantUrl, merchantOnly);
    }, merchantOnly);

    // Handle add_to_cart event as a pageview
    this.register.addToCart(() => {
      this.sendCommand(TRACK_PAGE_VIEW, 'add_to_cart');
    });

    // smart app banner
    this.register.smartbanner((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('Smartbanner', data));
    });

    // scroll to top button event
    this.register.scrollTop((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('ScrollTop', data), shopgateOnly);
    });

    // qr scanner events
    this.register.qrScanner((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('QRScanner', data));
    });

    // ad scanner events
    this.register.adScanner((data, originalData, scope) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('AdScanner', data), scope);
    });

    // credit card scanner events
    this.register.ccScanner((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('CcScanner', data));
    });

    // filter in live suggest events
    this.register.filterLiveSuggest((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('FilterLiveSuggest', data), shopgateOnly);
    });

    // deeplink
    this.register.openDeepLink((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('DeepLinkOpen', data), shopgateOnly);
    });

    // universal link
    this.register.openUniversalLink((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('UniversalLinkOpen', data), shopgateOnly);
    });

    // deferred deep link
    this.register.openDeferredDeepLink((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('DeferredDeepLinkOpen', data), shopgateOnly);
    });

    // smart app download link
    this.register.openSmartAppDownloadLink((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('SmartAppDownloadLink', data), shopgateOnly);
    });

    // push notification
    this.register.openPushNotification((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('PushNotification', data), shopgateOnly);
    });

    // app review prompt
    this.register.appReviewPrompt((data) => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('AppReviewPrompt', data), shopgateOnly);
    });

    // purchase events
    this.register.purchase((data, rawData) => {
      this.sendCommand(
        'require',
        ['ecommerce', 'ecommerce.js'],
        null,
        ACCOUNT_UNIVERSAL
      );

      this.sendCommand(TRACK_CONVERSION.START, account => ({
        amountCompleteFloat: account.useNetPrices ? data.revenueNet : data.revenueGross,
        amountTaxCompleteFloat: data.tax,
        amountShippingFloat: account.useNetPrices ? data.shippingNet : data.shippingGross,
        city: rawData.order.shippingAddress.city,
        countryId: rawData.order.shippingAddress.country,
        currency: data.currency,
        orderNumber: data.id,
        shopName: data.affiliation,
        state: rawData.order.shippingAddress.stateId || '',
      }));

      data.items.forEach((item) => {
        this.sendCommand(TRACK_CONVERSION.ADDITEM, account => ({
          orderNumber: rawData.order.number,
          productNumber: item.id,
          name: item.name,
          quantity: item.quantity,
          unitAmount: account.useNetPrices ? item.priceNet : item.priceGross,
        }));
      });

      this.sendCommand(
        TRACK_SET,
        [TRACK_CONVERSION.CURRENCY, data.currency],
        null,
        ACCOUNT_CLASSIC
      );

      this.sendCommand(TRACK_CONVERSION.END);
    });

    // opt-out
    this.register.removeTracker(() => {
      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('analyticsOptOut', {
        eventAction: 'optOut',
        eventLabel: 'all_accounts',
      }));

      this.accounts.forEach((account) => {
        const disableStr = `ga-disable-${account.id}`;
        document.cookie = `${disableStr}=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
        window[disableStr] = true;
      });
    });

    // revert opt-out
    this.register.addTracker(() => {
      this.accounts.forEach((account) => {
        const disableStr = `ga-disable-${account.id}`;
        document.cookie = `${disableStr}=false; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/`;
        window[disableStr] = false;
      });

      this.sendCommand(TRACK_EVENT, SgGATracking.getEventData('revertOptOut', {
        eventAction: 'optOut',
        eventLabel: 'all_accounts',
      }));
    });
  }

  /**
   * Creates an ga universals child tracker
   * @param {Object} tracker Tracker configuration data
   * @returns {SgGAUniversalTracking} plugin instance
   */
  createUniversal(tracker) {
    this.accounts.push(...tracker.config.merchant, tracker.config.shopgate);

    this.universalPlugin = new SgGAUniversalTracking(tracker);
    this.registerEvents();
    return this.universalPlugin;
  }

  /**
   * Creates an ga classic child tracker
   * @param {Object} tracker Tracker configuration data
   * @returns {SgGAClassicTracking} plugin instance
   */
  createClassic(tracker) {
    this.accounts.push(...tracker.config.merchant);

    this.classicPlugin = new SgGAClassicTracking(tracker);
    this.registerEvents();
    return this.classicPlugin;
  }
}

// Export and create global instance
window.SgGATrackingInstance = new SgGATracking();

export default window.SgGATrackingInstance;
