/* global ga */

/**
 * Tracking plugin for google analytics classic accounts
 *
 * @param {Object}  options                   Common Tracking Configuration
 * @param {boolean} [options.overrideUnified] If true -> overrides our unified tracking system
 * @param {boolean} [options.useNativeSdk]    If true -> send data via our unified tracking system
 *                                            to the native sdk
 * @param {Object}  [options.config]          Configuration for facebook pixel tracking
 *
 * @constructor
 */
function SgGAUniversalTracking(options) {
  // sgData access type constant for apps
  const ACCESS_TYPE_APP = 'App';

  // dimensions and metrics
  // see: https://shopgate.atlassian.net/wiki/display/CONSUMER/Google+Analytics
  const DIMENSION_SHOP_NUMBER = 'dimension1';
  const DIMENSION_CODEBASE_VERSION = 'dimension2';

  const merchantAccounts = options.config.merchant;
  const shopgateAccount = options.config.shopgate;
  const universalCleanCodesCache = {};

  // load the SDK (if the code is executed form a unit test, always load the sdk)
  if (typeof window.ga !== 'function' || (typeof global !== 'undefined' && typeof global.it === 'function')) {
    /* eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* eslint-enable */
  }

  /**
   * List of functions that can be used to filter data
   * @type {Object}
   */
  const filters = {
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

  /**
   * Removes '-' characters from tracker ID.
   * This, sanitized string is then used as an
   * identifier for universal tracker functions.
   *
   * @param {string} code Google Analytics Property ID
   * @returns {string} sanitized merchantCode
   * @private
   */
  function getCleanUniversalMerchantCode(code) {
    if (!universalCleanCodesCache.hasOwnProperty(code)) {
      universalCleanCodesCache[code] = code.replace(/-/g, '');
    }

    return universalCleanCodesCache[code];
  }

  /**
   * Helper to generate the prefix for an account
   *
   * @param {string} id Id of the account
   * @returns {string} Prefix for the account
   * @private
   */
  const buildMerchantPrefix = id => `merchant_${getCleanUniversalMerchantCode(id)}`;

  /**
   * Sends a command to the google universal sdk
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

    const useSendCmd = command !== 'require' && command.indexOf(':') === -1;
    const mergedScope = { ...defaults, ...scope };

    if (mergedScope.merchant) {
      merchantAccounts.forEach((account) => {
        let data = typeof payload === 'function' ? payload(account) : payload;
        data = typeof filters[command] !== 'undefined' ? filters[command](data) : data;

        const merchantPrefix = buildMerchantPrefix(account.id);
        const cmd = [command];

        if (useSendCmd) {
          cmd.unshift(`${merchantPrefix}.send`);
        } else {
          // we don't need the send command for example for ecommerce:addTransaction
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
      let data = typeof payload === 'function' ? payload(shopgateAccount) : payload;
      data = typeof filters[command] !== 'undefined' ? filters[command](data) : data;

      const cmd = [command];

      if (useSendCmd) {
        cmd.unshift('shopgate.send');
      } else {
        // we don't need the send command for example for ecommerce:addTransaction
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
  };

  // setup merchant accounts
  merchantAccounts.forEach((account) => {
    ga('create', {
      trackingId: account.id,
      cookieDomain: 'auto',
      name: buildMerchantPrefix(account.id),
      allowLinker: true,
    });

    ga(`${buildMerchantPrefix(account.id)}.set`, 'anonymizeIp', true);
    ga(`${buildMerchantPrefix(account.id)}.set`, 'forceSSL', true);
  });

  // setup shopgate account
  ga('create', {
    trackingId: shopgateAccount.id,
    cookieDomain: 'auto',
    name: 'shopgate',
    allowLinker: true,
  });

  ga('shopgate.set', 'anonymizeIp', true);
  ga('shopgate.set', 'forceSSL', true);

  // send custom variables to sdk
  ga('shopgate.set', DIMENSION_SHOP_NUMBER, window.sgData.shop.shop_number.toString());

  if (window.sgData.device.access === ACCESS_TYPE_APP) {
    ga('shopgate.set', DIMENSION_CODEBASE_VERSION, window.sgData.device.codebase);
  }
}

export default SgGAUniversalTracking;
