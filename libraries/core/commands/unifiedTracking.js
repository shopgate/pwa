import AppCommand from '../classes/AppCommand';

/**
 * Data definitions of the multiple tracking events
 */

/**
 * Data definition for a pageview event within the unified tracking system
 * @typedef {Object} UnifiedPageview
 * @property {string} type The type of the current page. Something like "Product" or "Checkout"
 * @property {string} id A unique identifier for the current page, like an item number or page title
 * @property {string} name A name to easier distinguish this item in the tracking tool
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for the payload of a custom event within the unified tracking system
 * @typedef {Object} UnifiedEvent
 * @property {string} shortName Short name of the event that shall be logged
 * @property {string} category Category of the event
 * @property {string} action The action that shall be logged
 * @property {string} name Name of the event
 * @property {Object} [customParams] Custom parameters that will be logged with the event
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for a purchase event within the unified tracking system
 * @typedef {Object} UnifiedPurchase
 * @property {string} id A unique ID representing the transaction.
 *   This ID should not collide with other transaction IDs.
 * @property {string} affiliation An entity with which the transaction should be affiliated
 *   (e.g. a particular store)
 * @property {number} revenueGross The total gross revenue of a transaction,
 *   including tax and shipping, payment costs
 * @property {number} revenueNet The total net revenue of a transaction,
 *   including tax and shipping, payment costs
 * @property {number} tax The total tax for a transaction
 * @property {number} shippingGross The total gross cost of shipping for a transaction
 * @property {number} shippingNet The total net cost of shipping for a transaction
 * @property {string} currency The currency code as ISO 4217 string
 * @property {UnifiedPurchaseItem[]} items Array of unified items
 * @property {string} [type] Type of checkout
 * @property {boolean} [success] Whether the Purchase was successful, or not
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addToCart event within the unified tracking system
 * @typedef {Object} UnifiedAddToCart
 * @property {UnifiedAddToCartItem[]} items Array of unified items
 * @property {string} position Position where the add to cart took place
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addedPaymentInfo event within the unified tracking system
 * @typedef {Object} UnifiedAddedPaymentInfo
 * @property {bool} success If it was success or not
 * @property {string} name Name of the payment method
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an InitiatedCheckout event within the unified tracking system
 * @typedef {Object} UnifiedInitiatedCheckout
 * @property {number} valueNet The net value of the items in the cart
 * @property {number} valueGross The gross value of the items in the cart
 * @property {string} [type] The type of the checkout
 * @property {string} [id] The content ID
 * @property {boolean} [paymentInfoAvailable] Whether the paymentInfo is available
 * @property {string} [currency] The currency code as ISO 4217 string.
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for a completedRegistration within the unified tracking system
 * @typedef {Object} UnifiedCompletedRegistration
 * @property {string} registrationMethod The type of the registration
 *  (default_account, guest_account, facebook, 'connect_register')
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addToWishlist event within the unified tracking system
 * @typedef {Object} UnifiedAddToWishlist
 * @property {UnifiedAddToWishlistItem[]} items Array of unified wishlist items
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addToWishlist item within the unified tracking system
 * @typedef {Object} UnifiedAddToWishlistItem
 * @property {number} priceNet The net price of the product
 * @property {number} priceGross The gross price of the product
 * @property {string} currency The currency code as ISO 4217 string
 * @property {string} [categoryId] The unique identifier of the category the product belongs
 * @property {string} [categoryName] Human readable name of the category the product belongs
 * @property {string} id Unique item identifier, eg product number of shop
 * @property {string} type The type of the item, eg "product"
 * @property {string} name The name of the item
 * @property {string} [brand] The brand of the product
 */

/**
 * Data definition for an search event within the unified tracking system
 * @typedef {Object} UnifiedSearched
 * @property {string} [query] The query string that has been used for the search
 * @property {boolean} [success] Boolean whether the search was successful or not
 * @property {string} [type] The type of the content that has been searched
 * @property {number} [hits] Amount of hits, the search brought.
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for a set campaign with url command payload within the unified tracking system
 * @typedef {Object} UnifiedSetCampaignWithUrl
 * @property {string} url The campaign url that shall be set
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for a log item view command payload within the unified tracking system
 * @typedef {Object} UnifiedItemview
 * @property {string} id A unique identifier for the item
 * @property {string} name A name to easier distinguish this item in the tracking tool
 * @property {string} type An identifier for the type of the item like "simple", "configurable"
 * @property {number} priceNet The net price of the item
 * @property {number} priceGross The gross price of the item
 * @property {string} currency The currency code as ISO 4217 string
 * @property {string} variant A summary of selected item options
 * @property {string} [brand] The brand of the item
 * @property {string} [categoryId] A unique identifier for the category of the item
 * @property {string} [categoryName] Category path of the item (apparel/shoes/sneakers)
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Additional definitions of data for the multiple tracking events
 */

/**
 * Restrictions for a unified tracking command
 * @typedef {Object} UnifiedRestrictions
 * @property {boolean} blacklist If set to TRUE, this event is not sent to the trackers named
 *   in the tracker-array within this restriction object, if set to FALSE, this event is only sent
 *   to the trackers in the tracker-array.
 * @property {Array} trackers List of tracker names that are concerned of this restriction
 */

/**
 * Executes a unified tracking command
 * @param {string} name The name of the command
 * @param {Object} params The payload for the command
 */
function executeCommand(name = '', params = {}) {
  const command = new AppCommand();

  command
    .setCommandName(name)
    .dispatch(params);
}

/**
 * This command can be used to log a viewContent event to all installed trackers. *
 * @param {UnifiedPageview} data The payload for the command
 */
export function analyticsLogPageview(data) {
  executeCommand('analyticsLogPageview', data);
}

/**
 * This command can be used to log an event to all installed trackers.
 * @param {UnifiedEvent} data The payload for the command
 */
export function analyticsLogEvent(data) {
  executeCommand('analyticsLogEvent', data);
}

/**
 * This command can be used to log a purchase event to all installed trackers.
 * @param {UnifiedPurchase} data The payload for the command
 */
export function analyticsLogPurchase(data) {
  executeCommand('analyticsLogPurchase', data);
}

/**
 * This command can be used to log an addToCart event to all installed trackers.
 * @param {UnifiedAddToCart} data The payload for the command
 */
export function analyticsLogAddToCart(data) {
  executeCommand('analyticsLogAddToCart', data);
}

/**
 * This command can be used to log an analyticsLogAddedPaymentInfo event to all installed trackers.
 * @param {UnifiedAddedPaymentInfo} data The payload for the command
 */
export function analyticsLogAddedPaymentInfo(data) {
  executeCommand('analyticsLogAddedPaymentInfo', data);
}

/**
 * This command can be used to log an initiated checkout event.
 * @param {UnifiedInitiatedCheckout} data The payload for the command
 */
export function analyticsLogInitiatedCheckout(data) {
  executeCommand('analyticsLogInitiatedCheckout', data);
}

/**
 * Logs which registration type was done.
 * @param {UnifiedCompletedRegistration} data The payload for the command
 */
export function analyticsLogCompletedRegistration(data) {
  executeCommand('analyticsLogCompletedRegistration', data);
}

/**
 * This command can be used to log an addToWishlist event to all installed trackers.
 * @param {UnifiedAddToWishlist} data The payload for the command
 */
export function analyticsLogAddToWishlist(data) {
  executeCommand('analyticsLogAddToWishlist', data);
}

/**
 * This command can be used to log a searched event to all installed trackers.
 * @param {UnifiedSearched} data The payload for the command
 */
export function analyticsLogSearch(data) {
  executeCommand('analyticsLogSearch', data);
}

/**
 * This command set a campaign url a user followed.
 * @param {UnifiedSetCampaignWithUrl} data The payload for the command
 */
export function analyticsSetCampaignWithUrl(data) {
  executeCommand('analyticsSetCampaignWithUrl', data);
}

/**
 * This command can be used to log an item view event to all installed trackers.
 * @param {UnifiedItemview} data The payload for the command
 */
export function analyticsLogItemview(data) {
  executeCommand('analyticsLogItemview', data);
}
