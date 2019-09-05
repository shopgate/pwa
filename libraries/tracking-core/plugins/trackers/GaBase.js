import BasePlugin from '../Base';
import SgGAUniversalTracking from './GaUniversal';
import SgGAClassicTracking from './GaClassic';
import { SGLink } from '../../helpers/helper';

const TRACK_PAGE_VIEW = 'pageView';
const TRACK_EVENT = 'event';
const TRACK_SET = 'set';
const TRACK_REQUIRE = 'require';
const TRACK_CONVERSION = {
  ADDITEM: 'addItem',
  CURRENCY: 'currencyCode',
  END: 'trackTrans',
  START: 'addTrans',
  PAGE: 'page',
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

// Command mapping tuple, [classic, universal]
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
class GaBase extends BasePlugin {
  /**
   * Constructor
   */
  constructor() {
    super('GAcore', {});

    // Universal and classic merchant and shopgate accounts
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

    // Smart app banner
    this.register.smartbanner((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('Smartbanner', data));
    });

    // Scroll to top button event
    this.register.scrollTop((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('ScrollTop', data), shopgateOnly);
    });

    // Qr scanner events
    this.register.qrScanner((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('QRScanner', data));
    });

    // Ad scanner events
    this.register.adScanner((data, originalData, scope) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('AdScanner', data), scope);
    });

    // Credit card scanner events
    this.register.ccScanner((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('CcScanner', data));
    });

    // Filter in live suggest events
    this.register.filterLiveSuggest((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('FilterLiveSuggest', data), shopgateOnly);
    });

    // Deeplink
    this.register.openDeepLink((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('DeepLinkOpen', data), shopgateOnly);
    });

    // Universal link
    this.register.openUniversalLink((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('UniversalLinkOpen', data), shopgateOnly);
    });

    // Deferred deep link
    this.register.openDeferredDeepLink((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('DeferredDeepLinkOpen', data), shopgateOnly);
    });

    // Smart app download link
    this.register.openSmartAppDownloadLink((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('SmartAppDownloadLink', data), shopgateOnly);
    });

    // Push notification
    this.register.openPushNotification((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('PushNotification', data), shopgateOnly);
    });

    // Push notification
    this.register.setCampaignWithUrl((data, raw) => {
      const shopgateUrl = new SGLink(data.url);
      shopgateUrl.setUtmParams(data, raw);
      this.sendCommand(TRACK_SET, TRACK_CONVERSION.PAGE, shopgateUrl.toString(), null);
      this.sendCommand(TRACK_PAGE_VIEW, shopgateUrl.toString(), shopgateOnly);
    });

    // App review prompt
    this.register.appReviewPrompt((data) => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('AppReviewPrompt', data), shopgateOnly);
    });

    // Purchase events
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

    // Opt-out
    this.register.removeTracker(() => {
      this.sendCommand(TRACK_EVENT, GaBase.getEventData('analyticsOptOut', {
        eventAction: 'optOut',
        eventLabel: 'all_accounts',
      }));

      this.accounts.forEach((account) => {
        const disableStr = `ga-disable-${account.id}`;
        document.cookie = `${disableStr}=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
        window[disableStr] = true;
      });
    });

    // Revert opt-out
    this.register.addTracker(() => {
      this.accounts.forEach((account) => {
        const disableStr = `ga-disable-${account.id}`;
        document.cookie = `${disableStr}=false; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/`;
        window[disableStr] = false;
      });

      this.sendCommand(TRACK_EVENT, GaBase.getEventData('revertOptOut', {
        eventAction: 'optOut',
        eventLabel: 'all_accounts',
      }));
    });
  }

  /**
   * Creates an ga universals child tracker
   * @param {Object} tracker Tracker configuration data
   * @returns {GaUniversal} plugin instance
   */
  createUniversal(tracker) {
    this.accounts.push(...tracker.config.merchant, tracker.config.shopgate);

    this.universalPlugin = new SgGAUniversalTracking(tracker);
    this.registerEvents();
    return this.universalPlugin;
  }

  /**
   * Creates a ga classic child tracker
   * @param {Object} tracker Tracker configuration data
   * @returns {GaClassic} plugin instance
   */
  createClassic(tracker) {
    this.accounts.push(...tracker.config.merchant);

    this.classicPlugin = new SgGAClassicTracking(tracker);
    this.registerEvents();
    return this.classicPlugin;
  }
}

// Export and create global instance
window.SgGATrackingInstance = new GaBase();

export default window.SgGATrackingInstance;
