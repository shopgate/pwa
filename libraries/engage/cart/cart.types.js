/* eslint-disable max-len */
/**
 * @typedef {import('@shopgate/pwa-common-commerce/cart').COUPON_TYPE_FIXED} COUPON_TYPE_FIXED
 * @typedef {import('@shopgate/pwa-common-commerce/cart').COUPON_TYPE_PERCENTAGE} COUPON_TYPE_PERCENTAGE
 */
/* eslint-enable max-len */

/**
 * @typedef {Object} AddToCartProduct
 * @property {string} productId
 * @property {number} quantity
 * @property {{method: string, location: {code: string, name: string}}} [fulfillment]
 */

/**
 * @typedef {Object} ItemFulfillment
 * @property {string} method
 * @property {{code?: string, name?: string}} location
 */

/**
 * @typedef Item
 * @type {object}
 * @property {string} [cartItemId]
 * @property {string} [id]
 * @property {number} quantity
 * @property {string} [type]
 * @property {ItemFulfillment} [fulfillment]
 * @property {string} [fulfillmentLocationId]
 * @property {string} [fulfillmentMethod]
 * @property {Object.<string, any>} [product]
 * @property {any} [coupon]
 * @property {any[]} [messages]
 */

/**
 * @typedef {Object} SavedPrice
 * @property {COUPON_TYPE_FIXED|COUPON_TYPE_PERCENTAGE} type
 * @property {number} value
 */

/**
 * @typedef {Object} Coupon
 * @property {string} code
 * @property {SavedPrice} [savedPrice]
 * @property {any} [key] - Additional dynamic properties.
 */
