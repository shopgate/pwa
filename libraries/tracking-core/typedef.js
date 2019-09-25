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
 * Data definition for a search event within the unified tracking system
 * @typedef {Object} UnifiedSearch
 * @property {string} [query] The query string that has been used for the string
 * @property {boolean} [success] Boolean whether the search was successful or not
 * @property {string} [type] The type of the content that has been searched
 * @property {number} [hits] Amount of hits, the search brought
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
 * Data definition for a custom event within the unified tracking system
 * @typedef {Object} UnifiedCustomEvent
 * @property {string} eventCategory The event category
 * @property {string} eventAction The event action
 * @property {string} [eventLabel] The event label
 * @property {number} [eventValue] The event value
 * @property {boolean} [nonInteraction] If the event was triggered by a user interaction
 */

/**
 * Data definition for an addToCart event within the unified tracking system
 * @typedef {Object} UnifiedAddToCart
 * @property {UnifiedAddToCartItem[]} items Array of unified items
 * @property {string} position Position where the add to cart took place
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addToWishlist event within the unified tracking system
 * @typedef {Object} UnifiedAddToWishlist
 * @property {UnifiedAddToWishlistItem[]} items Array of unified wishlist items
 * @property {UnifiedRestrictions} [restrictions] Restrictions for the command
 */

/**
 * Data definition for an addedPaymentInfo event within the unified tracking system
 * @typedef {Object} UnifiedPaymentInfo
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
 * Data definitions of item data for the multiple tracking events
 */

/**
 * Data definition for a purchase item within the unified tracking system
 * @typedef {Object} UnifiedPurchaseItem
 * @property {string} type The type of the item, eg "product"
 * @property {string} name The name of the item
 * @property {string} id Unique item identifier, eg product number of shop
 * @property {number} priceNet The net price of the product
 * @property {number} priceGross The gross price of the product
 * @property {string} [currency] The currency code as ISO 4217 string.
 *   If there is no currency code given, the currency from the parent entity will be taken.
 * @property {number} [quantity] The quantity of the product. If not set, the value is set to 1
 * @property {string} [categoryId] The unique identifier of the category the product belongs
 * @property {string} [categoryName] Human readable name of the category the product belongs
 */

/**
 * Data definition for an addToCart item within the unified tracking system
 * @typedef {Object} UnifiedAddToCartItem
 * @property {string} type The type of the item, eg "product"
 * @property {string} name The name of the item
 * @property {string} id Unique item identifier, eg product number of shop
 * @property {number} priceNet The net price of the product
 * @property {number} priceGross The gross price of the product
 * @property {string} currency The currency code as ISO 4217 string
 * @property {number} [quantity] The quantity of the product. If not set, the value is set to 1
 * @property {string} [categoryId] The unique identifier of the category the product belongs
 * @property {string} [categoryName] Human readable name of the category the product belongs
 * @property {string} [brand] The brand of the product
 * @property {string} [couponCode] Position where the add to cart took place
 */

/**
 * Data definition for a completedRegistration within the unified tracking system
 * @typedef {Object} UnifiedCompletedRegistration
 * @property {string} registrationMethod The type of the registration
 *  (default_account, guest_account, facebook, 'connect_register')
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
 * @typedef {Object} RemoveListener
 * @property {Function} remove Function to remove the listener for a tracking event
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
