/* global _gaq */

/**
 * Tracking plugin for google analytics classic accounts
 */
class GaClassic {
  /**
   * Constructor
   * @param {Object} options Common Tracking Configuration
   * @param {boolean} [options.overrideUnified] If true -> overrides our unified tracking system
   * @param {boolean} [options.useNativeSdk] If true -> send data via our unified tracking system
   *  to the native sdk
   * @param {Object} [options.config] Configuration for google analytics classic tracking
   */
  constructor(options) {
    // eslint-disable-next-line no-underscore-dangle
    window._gaq = window._gaq || [];

    this.merchantAccounts = options.config.merchant;

    /**
     * List of functions that can be used to filter data
     * @type {Object}
     */
    this.filters = {
      addTrans(data) {
        return [
          data.orderNumber,
          data.shopName,
          data.amountCompleteFloat,
          data.amountTaxCompleteFloat,
          data.amountShippingFloat,
          data.city,
          '', // State
          data.countryId,
        ];
      },
      addItem(data) {
        return [
          data.orderNumber,
          data.productNumber,
          data.name,
          '',
          data.unitAmount,
          data.quantity,
        ];
      },
      trackEvent(data) {
        return [
          data.eventCategory,
          data.eventAction,
          data.eventLabel,
          data.eventValue,
          data.nonInteraction,
        ];
      },
    };

    this.initPlugin();
  }

  /**
   * Initiate and setup the SDK
   */
  initPlugin() {
    // Load the SDK
    /* eslint-disable eslint-comments/no-unlimited-disable */
    /* eslint-disable */
    if ((typeof window._gaq === 'undefined' || typeof window._gaq._getAsyncTracker === 'undefined') || (global && global.it)) {
      (function() {
        var gaJs = document.createElement('script'); gaJs.type = 'text/javascript'; gaJs.async = true;
        gaJs.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaJs, s);
      })();
    }
    /* eslint-enable */

    // Setup merchant accounts
    this.merchantAccounts.forEach((account, index) => {
      const prefix = `${GaClassic.buildMerchantPrefix(index ? account.id : '')}.`;

      _gaq.push(
        [`${prefix}_setAccount`, account.id],
        [`${prefix}_setAllowLinker`, true]
      );
    });

    // Set global options
    _gaq.push(
      ['_gat._anonymizeIp', true],
      ['_gat._forceSSL', true]
    );
  }

  /**
   * Helper to generate the prefix for an account
   *
   * @param {string} id Id of the account
   * @returns {string} Prefix for the account
   */
  static buildMerchantPrefix(id) {
    return `merchant_${id}`;
  }

  /**
   * Function that sends the given command with the payload to the GA SDK
   * @param {string} command Name of the command
   * @param {Object|Array|string|Function} payload Data for the command,
   *  or a function that returns data
   * @param {Object} [scope={}] Info if the event is for merchant and/or shopgate account
   */
  send(command, payload, scope = {}) {
    const defaults = {
      merchant: true,
      shopgate: true,
    };

    const mergedScope = {
      ...defaults,
      ...scope,
    };

    /**
     * Since we migrates all our classic account to universal,
     * Only the merchant can have classic accounts
     */
    if (mergedScope.merchant) {
      this.merchantAccounts.forEach((account, index) => {
        let data = typeof payload === 'function' ? payload(account) : payload;
        data = typeof this.filters[command] !== 'undefined' ? this.filters[command](data) : data;

        const cmd = `${GaClassic.buildMerchantPrefix(index ? account.id : '')}._${command}`;

        if (Array.isArray(data)) {
          _gaq.push([cmd, ...data]);
        } else {
          _gaq.push([cmd, data]);
        }
      });
    }
  }
}

export default GaClassic;
