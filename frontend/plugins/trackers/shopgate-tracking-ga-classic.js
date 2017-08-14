/* global _gaq */

/**
 * Tracking plugin for google analytics classic accounts
 *
 * @param {Object}  options                   Common Tracking Configuration
 * @param {boolean} [options.overrideUnified] If true -> overrides our unified tracking system
 * @param {boolean} [options.useNativeSdk]    If true -> send data via our unified tracking system
 *                                            to the native sdk
 * @param {Object}  [options.config]          Configuration for google analytics classic tracking
 *
 * @constructor
 */
function SgGAClassicTracking(options) {
  const merchantAccounts = options.config.merchant;

  // eslint-disable-next-line no-underscore-dangle
  window._gaq = window._gaq || [];

  /**
   * List of functions that can be used to filter data
   * @type {Object}
   */
  const filters = {
    addTrans(data) {
      return [
        data.orderNumber,
        data.shopName,
        data.amountCompleteFloat,
        data.amountTaxCompleteFloat,
        data.amountShippingFloat,
        data.city,
        '', // state
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

  /**
   * Helper to generate the prefix for an account
   *
   * @param {string} id Id of the account
   * @returns {string} Prefix for the account
   * @private
   */
  const buildMerchantPrefix = id => `merchant_${id}`;

  /**
   * Sends a command to the google classic sdk
   *
   * @param {string} command Name of the command
   * @param {Object|Array|string|Function} [payload] Data for the command, or a function that
   *   will return data based on tracker configuration, (useNetPrices for example)
   * @param {Object} [scope] What scope is affected
   */
  this.send = function (command, payload, scope = {}) {
    const defaults = {
      merchant: true,
      shopgate: true,
    };

    const mergedScope = { ...defaults, ...scope };

    // since we migrates all our classic account to universal,
    // only the merchant can have classic accounts
    if (mergedScope.merchant) {
      merchantAccounts.forEach((account, index) => {
        let data = typeof payload === 'function' ? payload(account) : payload;
        data = typeof filters[command] !== 'undefined' ? filters[command](data) : data;

        const cmd = `${buildMerchantPrefix(index ? account.id : '')}._${command}`;

        if (Array.isArray(data)) {
          _gaq.push([cmd, ...data]);
        } else {
          _gaq.push([cmd, data]);
        }
      });
    }
  };

  // load the SDK
  /* eslint-disable */
  if ((typeof window._gaq === 'undefined' || typeof window._gaq._getAsyncTracker === 'undefined') || (global && global.it)) {
    (function() {
      var gaJs = document.createElement('script'); gaJs.type = 'text/javascript'; gaJs.async = true;
      gaJs.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaJs, s);
    })();
  }
  /* eslint-enable */

  // setup merchant accounts
  merchantAccounts.forEach((account, index) => {
    const prefix = `${buildMerchantPrefix(index ? account.id : '')}.`;

    _gaq.push(
      [`${prefix}_setAccount`, account.id],
      [`${prefix}_setAllowLinker`, true]
    );
  });

  // set global options
  _gaq.push(
    ['_gat._anonymizeIp', true],
    ['_gat._forceSSL', true]
  );
}

export default SgGAClassicTracking;
