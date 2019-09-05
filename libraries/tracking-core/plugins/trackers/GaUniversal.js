/* global ga */

// SgData access type constant for apps
const ACCESS_TYPE_APP = 'App';

/**
 * Dimensions and metrics
 * See: https://shopgate.atlassian.net/wiki/display/CONSUMER/Google+Analytics
 */
const DIMENSION_SHOP_NUMBER = 'dimension1';
const DIMENSION_CODEBASE_VERSION = 'dimension2';

/**
 * Tracking plugin for google analytics classic accounts
 */
class GaUniversal {
  /**
   * Constructor
   *
   * @param {Object} options Common Tracking Configuration
   * @param {boolean} [options.overrideUnified] If true -> overrides our unified tracking system
   * @param {boolean} [options.useNativeSdk] If true -> send data via our unified tracking system
   *   to the native sdk
   * @param {Object} [options.config] Configuration for facebook pixel tracking
   */
  constructor(options) {
    this.merchantAccounts = options.config.merchant;
    this.shopgateAccount = options.config.shopgate;

    this.universalCleanCodesCache = {};

    /**
     * List of functions that can be used to filter data
     * @type {Object}
     */
    this.filters = {
      'ecommerce:addTransaction': data => ({
        revenue: data.amountCompleteFloat,
        tax: data.amountTaxCompleteFloat,
        shipping: data.amountShippingFloat,
        currency: data.currency,
        id: data.orderNumber,
        affiliation: data.shopName,
      }),
      'ecommerce:addItem': data => ({
        id: data.orderNumber,
        name: data.name,
        price: data.unitAmount,
        quantity: data.quantity,
        sku: data.productNumber,
      }),
    };

    this.initPlugin();
  }

  /**
   * Initiate and setup the SDK
   */
  initPlugin() {
    // Load the SDK (if the code is executed form a unit test, always load the sdk)
    if (typeof window.ga !== 'function' || (typeof global !== 'undefined' && typeof global.it === 'function')) {
      /* eslint-disable eslint-comments/no-unlimited-disable */
      /* eslint-disable */
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      /* eslint-enable */
    }

    // Setup merchant accounts
    this.merchantAccounts.forEach((account) => {
      ga('create', {
        trackingId: account.id,
        cookieDomain: 'auto',
        name: this.buildMerchantPrefix(account.id),
        allowLinker: true,
      });

      ga(`${this.buildMerchantPrefix(account.id)}.set`, 'anonymizeIp', true);
      ga(`${this.buildMerchantPrefix(account.id)}.set`, 'forceSSL', true);
    });

    // Setup shopgate account
    ga('create', {
      trackingId: this.shopgateAccount.id,
      cookieDomain: 'auto',
      name: 'shopgate',
      allowLinker: true,
    });

    ga('shopgate.set', 'anonymizeIp', true);
    ga('shopgate.set', 'forceSSL', true);

    // Send custom variables to sdk
    ga('shopgate.set', DIMENSION_SHOP_NUMBER, window.sgData.shop.shop_number.toString());

    if (window.sgData.device.access === ACCESS_TYPE_APP) {
      ga('shopgate.set', DIMENSION_CODEBASE_VERSION, window.sgData.device.codebase);
    }
  }

  /**
   * Removes '-' characters from tracker ID.
   * This, sanitized string is then used as an
   * identifier for universal tracker functions.
   *
   * @param {string} code Google Analytics Property ID
   * @returns {string} sanitized merchantCode
   */
  getCleanUniversalMerchantCode(code) {
    if (!this.universalCleanCodesCache.hasOwnProperty(code)) {
      this.universalCleanCodesCache[code] = code.replace(/-/g, '');
    }

    return this.universalCleanCodesCache[code];
  }

  /**
   * Helper to generate the prefix for an account
   *
   * @param {string} id Id of the account
   * @returns {string} Prefix for the account
   */
  buildMerchantPrefix(id) {
    return `merchant_${this.getCleanUniversalMerchantCode(id)}`;
  }

  /**
   * Function that sends the given command with the payload to the GA SDK
   * @param {string} command Name of the command
   * @param {Object|Array|string|Function} payload Data for the command,
   *        or a function that returns data
   * @param {Object} [scope={}] Info if the event is for merchant and/or shopgate account
   */
  send(command, payload, scope = {}) {
    const defaults = {
      merchant: true,
      shopgate: true,
    };

    const useSendCmd = command !== 'require' && command.indexOf(':') === -1;
    const mergedScope = {
      ...defaults,
      ...scope,
    };

    if (mergedScope.merchant) {
      this.merchantAccounts.forEach((account) => {
        let data = typeof payload === 'function' ? payload(account) : payload;
        data = typeof this.filters[command] !== 'undefined' ? this.filters[command](data) : data;

        const merchantPrefix = this.buildMerchantPrefix(account.id);
        const cmd = [command];

        if (useSendCmd) {
          cmd.unshift(`${merchantPrefix}.send`);
        } else {
          // We don't need the send command for example for ecommerce:addTransaction
          cmd[0] = `${merchantPrefix}.${cmd[0]}`;
        }

        if (typeof data === 'undefined') {
          ga(...cmd.slice());
        } else if (Array.isArray(data)) {
          ga(...cmd.slice(), ...data);
        } else {
          ga(...cmd.slice(), data);
        }
      });
    }

    if (mergedScope.shopgate) {
      let data = typeof payload === 'function' ? payload(this.shopgateAccount) : payload;
      data = typeof this.filters[command] !== 'undefined' ? this.filters[command](data) : data;

      const cmd = [command];

      if (useSendCmd) {
        cmd.unshift('shopgate.send');
      } else {
        // We don't need the send command for example for ecommerce:addTransaction
        cmd[0] = `shopgate.${cmd[0]}`;
      }

      if (typeof data === 'undefined') {
        ga(...cmd.slice());
      } else if (Array.isArray(data)) {
        ga(...cmd.slice(), ...data);
      } else {
        ga(...cmd.slice(), data);
      }
    }
  }
}

export default GaUniversal;
