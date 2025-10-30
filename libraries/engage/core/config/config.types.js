/**
 * @typedef {Object} MerchantSettings
 * @property {string[]} enabledFulfillmentMethods
 * @property {string[]} enabledFulfillmentMethodSelectionForEngage
 */

/**
 * @typedef {Object} ShopSettings
 * @property {string[]} [supportedCountries]
 * @property {string[]} [countrySortOrder]
 */

/**
 * @typedef {Object} ConfigState
 * @property {boolean} isFetching
 * @property {number} expires
 * @property {MerchantSettings} merchantSettings
 * @property {ShopSettings} shopSettings
 */
